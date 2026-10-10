// Lossless reviewed-packet transcription. No cumulative composition or audio calls.
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
export const tagMappings={
 'vocabulary.food_preparation':'vocabulary.collocations',
 'vocabulary.learning_collocations':'vocabulary.collocations',
 'vocabulary.collocation':'vocabulary.collocations',
 'vocabulary.context':'vocabulary.meaning_in_context',
 'reading.compare_information':'reading.detail',
 'reading.main_claim':'reading.gist',
 'reading.qualification':'reading.inference',
 'listening.time':'listening.detail',
 'listening.speaker_preference':'listening.speaker_intention',
 'listening.qualification':'listening.inference'
};
const clean=s=>s.trim().replace(/  \n/g,'\n');
const section=(s,title)=>clean(s.split('## '+title+'\n')[1]?.split('\n## ')[0]??'');
export function buildBatch(packet){
 const blocks=packet.split(/\n# LESSON \d+ — /).slice(1,7);
 const lessons=blocks.map(block=>{
  const id=block.split('\n')[0].trim();
  const value=k=>block.match(new RegExp('\\*\\*'+k+':\\*\\* (.+)'))?.[1].trim();
  const module=value('Module');
  const objectives=section(block,'Objectives').split('\n').filter(s=>/^\d+\. /.test(s)).map(s=>s.replace(/^\d+\. /,''));
  const learn=section(block,'Learn');
  const explanation=learn||section(block,'Audio design requirement')||section(block,'Objectives');
  const tags=[...block.matchAll(/`((?:vocabulary|reading|listening)\.[a-z_]+)`/g)].map(x=>x[1]);
  const skill_tags=[...new Set(tags.map(t=>tagMappings[t]??t))];
  const activities=[...block.matchAll(/### ([A-Z0-9-]+-Q\d+)\n([\s\S]*?)(?=\n### |\n\*\*Suggested tags:)/g)].map(([,qid,text])=>{
   const prompt=text.match(/\*\*Prompt:\*\* (.+)/)[1].trim();
   const options=[...text.matchAll(/^([A-D])\. (.+)$/gm)].map(([,id,text])=>({id,text:text.trim()}));
   const correct_option_id=text.match(/\*\*Answer:\*\* ([A-D])/)[1];
   const explanation_en=text.match(/\*\*(?:Why|Evidence):\*\* (.+)/)[1].trim();
   return {id:qid,type:'single_choice',prompt,options,answer:{correct_option_id},feedback:{explanation_en},skill_tags,evidence_weight:1};
  });
  const lesson={id,module,cefr_target:value('CEFR target'),title:value('Title'),estimated_minutes:parseInt(value('Estimated time')),objectives,explanation:{en:explanation},examples:[],activities};
  if(module==='reading'){
   const passage=section(block,'Passage');
   lesson.reading_asset={id:'READ-'+id,title:passage.split('\n')[0].replace(/^### /,''),body:passage,display_to_learner:true};
  }
  if(module==='listening'){
   const script=section(block,'Script').replace(/\*\*([^*]+):\*\*/g,'$1:');
   lesson.audio_asset={id:'AUD-'+id,source_text:script,language:'en',roles:[...new Set([...script.matchAll(/^([^:\n]+):/gm)].map(x=>x[1]))],transcript_reveal:'after_submission',requires_real_playback:true,fallback:'If playback is unavailable, mark listening unassessed; do not reveal the transcript first or award listening credit.'};
  }
  return lesson;
 });
 return {format:'ai-english-tutor.curriculum-batch',schema_version:1,batch_id:'VOCAB-READING-LISTENING-DENSITY-WAVE6-20261008',base_version:'1.14.0',target_version:'1.15.0',status:'academic_pass_audio_pending_no_composition_no_import',metadata:{status:'academic_pass_audio_pending_no_import',course_title:'English Foundation · A1–B1 developing curriculum',course_description:'Expand underrepresented A2→B1 content while GitHub Actions remain intentionally unused.',curriculum_principle:'A lesson target is not a CEFR certification.',evidence_weight:1,proficiency_weight:0,tag_mappings:tagMappings,audio_qa:'OWNER PENDING'},insert_after:['VOC-A2-04','VOC-B1-04','REA-A2-05','REA-B1-04','LIS-A2-02','LIS-B1-03'].map((after,i)=>({after,ids:[lessons[i].id]})),lessons};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const packet=readFileSync('content/review-packets/EN-VOC-REA-LIS-DENSITY-W6-20261008.md','utf8');
 writeFileSync('content/batches/vocab-reading-listening-density-wave6.json',JSON.stringify(buildBatch(packet),null,2)+'\n');
}
