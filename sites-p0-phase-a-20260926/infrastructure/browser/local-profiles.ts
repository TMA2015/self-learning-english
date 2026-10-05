import type {BrowserKeyValueStorage} from '../storage/browser-local-repositories';
import type {Scope} from '../../domain/repository';

export const LOCAL_OWNER_ID='local-family';
export const LEGACY_PRIMARY_LEARNER_ID='primary';

const PREFIX='g-learning:english:v1:profiles';
const INDEX_KEY=`${PREFIX}:index`;
const SELECTED_KEY=`${PREFIX}:selected`;

export type LocalLearnerProfile={
  id:string;
  preferredName:string;
  createdAt:number;
  updatedAt:number;
  archived?:boolean;
};

function clone<T>(value:T):T{return JSON.parse(JSON.stringify(value)) as T}
function validId(id:string){return /^[A-Za-z0-9_-]{1,120}$/.test(id)}
function cleanName(value:string){
  const name=String(value??'').replace(/\s+/g,' ').trim();
  if(!name||name.length>40)throw new Error('Learner name must be 1–40 characters.');
  return name;
}
function readIndex(storage:BrowserKeyValueStorage):LocalLearnerProfile[]|null{
  const raw=storage.getItem(INDEX_KEY);
  if(raw===null)return null;
  let rows:unknown;
  try{rows=JSON.parse(raw)}catch{throw new Error('Local learner profiles are corrupted. Restore a known-good backup before changing profiles.')}
  if(!Array.isArray(rows))throw new Error('Local learner profiles are corrupted. Restore a known-good backup before changing profiles.');
  const seen=new Set<string>();
  const parsed:LocalLearnerProfile[]=[];
  for(const row of rows){
    if(!row||typeof row!=='object'||Array.isArray(row))throw new Error('Local learner profiles are corrupted. Restore a known-good backup before changing profiles.');
    const value=row as Record<string,unknown>;
    if(typeof value.id!=='string'||!validId(value.id)||seen.has(value.id)||typeof value.preferredName!=='string'||!value.preferredName.trim()||value.preferredName.length>40||!Number.isFinite(value.createdAt)||!Number.isFinite(value.updatedAt))
      throw new Error('Local learner profiles are corrupted. Restore a known-good backup before changing profiles.');
    seen.add(value.id);
    parsed.push({
      id:value.id,
      preferredName:value.preferredName.trim(),
      createdAt:Number(value.createdAt),
      updatedAt:Number(value.updatedAt),
      ...(value.archived===true?{archived:true}:{}),
    });
  }
  return parsed;
}
function writeIndex(storage:BrowserKeyValueStorage,rows:LocalLearnerProfile[]){
  storage.setItem(INDEX_KEY,JSON.stringify(rows));
}
function initialProfile(now:number):LocalLearnerProfile{
  return {id:LEGACY_PRIMARY_LEARNER_ID,preferredName:'Learner 1',createdAt:now,updatedAt:now};
}

export function ensureLocalProfiles(storage:BrowserKeyValueStorage,now=Date.now()){
  let rows=readIndex(storage);
  if(rows===null||rows.length===0){
    rows=[initialProfile(now)];
    writeIndex(storage,rows);
  }
  const active=rows.filter(row=>!row.archived);
  if(active.length===0)throw new Error('At least one active local learner profile is required.');
  const selected=storage.getItem(SELECTED_KEY);
  if(!selected||!active.some(row=>row.id===selected)){
    storage.setItem(SELECTED_KEY,active[0].id);
  }
  return clone(rows);
}

export function listLocalProfiles(storage:BrowserKeyValueStorage){
  return ensureLocalProfiles(storage);
}

export function selectedLocalProfile(storage:BrowserKeyValueStorage){
  const rows=ensureLocalProfiles(storage);
  const selected=storage.getItem(SELECTED_KEY)!;
  const profile=rows.find(row=>row.id===selected&&!row.archived);
  if(!profile)throw new Error('Selected local learner profile is unavailable.');
  return clone(profile);
}

export function localScope(storage:BrowserKeyValueStorage):Scope{
  return {ownerId:LOCAL_OWNER_ID,learnerId:selectedLocalProfile(storage).id};
}

export function selectLocalProfile(storage:BrowserKeyValueStorage,id:string){
  const rows=ensureLocalProfiles(storage);
  if(!rows.some(row=>row.id===id&&!row.archived))throw new Error('Learner profile not found.');
  storage.setItem(SELECTED_KEY,id);
  return clone(rows.find(row=>row.id===id)!);
}

export function createLocalProfile(storage:BrowserKeyValueStorage,preferredName:string,options:{id?:string;now?:number}={}){
  const rows=ensureLocalProfiles(storage,options.now??Date.now());
  const id=options.id??('learner_'+crypto.randomUUID().replace(/-/g,''));
  if(!validId(id)||rows.some(row=>row.id===id))throw new Error('Invalid or duplicate learner profile ID.');
  const now=options.now??Date.now();
  const profile:LocalLearnerProfile={id,preferredName:cleanName(preferredName),createdAt:now,updatedAt:now};
  rows.push(profile);
  writeIndex(storage,rows);
  storage.setItem(SELECTED_KEY,id);
  return clone(profile);
}

export function renameLocalProfile(storage:BrowserKeyValueStorage,id:string,preferredName:string,now=Date.now()){
  const rows=ensureLocalProfiles(storage,now);
  const index=rows.findIndex(row=>row.id===id&&!row.archived);
  if(index<0)throw new Error('Learner profile not found.');
  rows[index]={...rows[index],preferredName:cleanName(preferredName),updatedAt:now};
  writeIndex(storage,rows);
  return clone(rows[index]);
}
