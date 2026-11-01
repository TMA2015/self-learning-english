/** Serializes route changes while a lesson confirms its draft save. */
export function createNavigationGate<T>() {
 let pending=false;
 return async (target:T, beforeLeave:(target:T)=>Promise<boolean>, commit:(target:T)=>void):Promise<boolean>=>{
  if(pending)return false;
  pending=true;
  try {
   if(!await beforeLeave(target))return false;
   commit(target);
   return true;
  } finally {pending=false}
 };
}

/** A newer edit during an in-flight save must be confirmed in a second write. */
export async function confirmLatestDraft(readRevision:()=>number,save:()=>Promise<void>):Promise<void>{
 let revision:number;
 do{revision=readRevision();await save()}while(revision!==readRevision());
}
