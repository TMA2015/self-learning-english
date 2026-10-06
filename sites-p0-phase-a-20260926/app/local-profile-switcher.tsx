"use client";
import {useMemo,useState} from "react";
import {UserRound,Plus,Pencil,ChevronDown} from "lucide-react";
import {
  createLocalLearnerProfile,
  loadLocalLearnerProfiles,
  renameLocalLearnerProfile,
  selectLocalLearnerProfile,
  type LearnerProfileSummary,
} from "../infrastructure/browser/client-services";

type Props={
  onProfileChanged?:()=>void;
};

export function LocalProfileSwitcher({onProfileChanged}:Props){
  const initial=useMemo(()=>loadLocalLearnerProfiles(),[]);
  const [profiles,setProfiles]=useState<LearnerProfileSummary[]>(initial.profiles);
  const [selected,setSelected]=useState<LearnerProfileSummary>(initial.selected);
  const [open,setOpen]=useState(false);
  const [creating,setCreating]=useState(false);
  const [name,setName]=useState("");
  const [error,setError]=useState("");

  function refresh(){
    const data=loadLocalLearnerProfiles();
    setProfiles(data.profiles);
    setSelected(data.selected);
  }

  function choose(id:string){
    setError("");
    try{
      const next=selectLocalLearnerProfile(id);
      setSelected(next);
      setOpen(false);
      onProfileChanged?.();
    }catch(e){setError(e instanceof Error?e.message:"Could not switch learner.")}
  }

  function create(){
    setError("");
    try{
      createLocalLearnerProfile(name);
      setName("");
      setCreating(false);
      refresh();
      onProfileChanged?.();
    }catch(e){setError(e instanceof Error?e.message:"Could not create learner.")}
  }

  function rename(){
    const next=window.prompt("Learner name",selected.preferredName);
    if(next===null)return;
    setError("");
    try{
      setSelected(renameLocalLearnerProfile(selected.id,next));
      refresh();
    }catch(e){setError(e instanceof Error?e.message:"Could not rename learner.")}
  }

  return <div className="local-profile-switcher" data-profile-ui="p0-hidden-until-qa">
    <button className="profile-trigger" type="button" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>
      <UserRound size={17}/>
      <span><small>LEARNER</small><strong>{selected.preferredName}</strong></span>
      <ChevronDown size={16}/>
    </button>
    {open&&<div className="profile-menu">
      <div className="profile-menu-list">
        {profiles.map(profile=><button key={profile.id} type="button" className={profile.id===selected.id?"profile-choice active":"profile-choice"} onClick={()=>choose(profile.id)}>
          <span>{profile.preferredName}</span>{profile.id===selected.id&&<small>Current</small>}
        </button>)}
      </div>
      <div className="profile-menu-actions">
        <button type="button" onClick={rename}><Pencil size={14}/> Rename</button>
        <button type="button" onClick={()=>setCreating(value=>!value)}><Plus size={14}/> Add learner</button>
      </div>
      {creating&&<div className="profile-create">
        <label>Preferred name<input autoFocus value={name} maxLength={40} onChange={e=>setName(e.target.value)} placeholder="e.g. Cá"/></label>
        <div><button type="button" onClick={()=>setCreating(false)}>Cancel</button><button type="button" className="primary-button" onClick={create}>Create</button></div>
      </div>}
      {error&&<p className="profile-error" role="alert">{error}</p>}
      <p className="profile-note">Each learner keeps separate progress on this device. Cloud sync is not enabled yet.</p>
    </div>}
  </div>;
}
