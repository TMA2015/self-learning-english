"""Local decoded-MP3 F0 gate; requires ffmpeg and praat-parselmouth/numpy."""
import json,subprocess,numpy as np,parselmouth
from pathlib import Path
root=Path(__file__).resolve().parents[1]
m=json.loads((root/'content/pronunciation-audio.json').read_text())['PRO-B1-02']
sr=m['sample_rate'];raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(root/'public'/m['url'].lstrip('/')),'-f','f32le','-ac','1','-ar',str(sr),'-'])
a=np.frombuffer(raw,dtype='<f4');offset=0;results=[]
for i,duration in enumerate(m['utterance_durations_seconds']):
 n=round(duration*sr);segment=a[offset:offset+n];offset+=n+round(.4*sr)
 p=parselmouth.Sound(segment,sampling_frequency=sr).to_pitch_ac(time_step=.01,pitch_floor=75,pitch_ceiling=450)
 h=p.selected_array['frequency'];t=p.xs();ok=h>0;h=h[ok];t=t[ok];end=t[-1]
 early=h[(t>=end-.3)&(t<end-.2)];late=h[t>=end-.1]
 assert len(early)>=5 and len(late)>=5,'Insufficient voiced samples'
 st=float(12*np.log2(np.median(late)/np.median(early)))
 assert st < -1 if i==0 else st>1,(i,st)
 assert abs(st-m['ending_semitones'][i])<.5,(i,st)
 results.append(round(st,4))
print(json.dumps({'result':'PASS','decodedMp3EndingSemitones':results}))
