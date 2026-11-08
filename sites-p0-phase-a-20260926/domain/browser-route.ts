/**
 * Browser-addressable navigation for the static Firebase English site.
 * Hash routes avoid server-side path rewrites and carry NO learner answers.
 * All IDs remain advisory until the academic repository validates a lesson.
 */
export const APP_VIEWS=[
 'units','writing-later-week','writing-week','writing-overview','writing-foundations',
 'writing-learn','writing-guided','writing-review','foundation','debug','dashboard',
 'diagnostic','profile','plan','courses','writing-course','skillmap','errorbank','writing',
 'curriculum','lesson','progress','parent','grammar','reading','listening','speaking',
 'vocabulary','pronunciation','specialization','tutor'
] as const;
export type AppView=typeof APP_VIEWS[number];
export type LessonScreen='overview'|'practice';
export type WritingRouteStep='learn'|'guided'|'main'|'feedback'|'review';
export type BrowserRoute={
 view:AppView;
 level?:'A1'|'A2'|'B1'|'B2'|'C1'|'C2';
 unitId?:string;
 lessonId?:string;
 screen?:LessonScreen;
 writingWeek?:number;
 writingStep?:WritingRouteStep;
};
export const FOUNDATION_VIEWS=new Set<AppView>([
 'units','foundation','grammar','reading','writing','listening','speaking',
 'vocabulary','pronunciation'
]);
const views=new Set<string>(APP_VIEWS);
const writingSteps=new Set(['learn','guided','main','feedback','review']);
const levels=new Set(['A1','A2','B1','B2','C1','C2']);
const lessonPattern=/^[A-Z0-9]+(?:-[A-Z0-9]+){2,}$/;
const unitPattern=/^(A1|A2|B1|B2|C1|C2)-U(0[1-9]|10)$/;
export function parseBrowserRoute(hash:string):BrowserRoute{
 if(!hash.startsWith('#/'))return {view:'dashboard'};
 let path:string;
 try{path=decodeURIComponent(hash.slice(2).split('?')[0]);}catch{return {view:'dashboard'}}
 const parts=path.split('/').filter(Boolean);
 if(!parts.length||!views.has(parts[0]))return {view:'dashboard'};
 const view=parts[0] as AppView;
 if(parts.length===1)return {view};
 if(view==='writing-week'||view==='writing-later-week'){
  const week=Number(parts[1]);
  const minimum=view==='writing-week'?2:7,maximum=view==='writing-week'?6:12;
  if(parts.length===3&&Number.isInteger(week)&&week>=minimum&&week<=maximum&&writingSteps.has(parts[2]))
   return {view,writingWeek:week,writingStep:parts[2] as WritingRouteStep};
  return {view};
 }
 if(view==='units'){
  const level=parts[1];
  if(!levels.has(level))return {view};
  const result:BrowserRoute={view,level:level as BrowserRoute['level']};
  if(parts.length===2)return result;
  const unitId=parts[2];
  if(!unitPattern.test(unitId)||!unitId.startsWith(level+'-'))return result;
  result.unitId=unitId;
  if(parts.length===3)return result;
  if(parts.length===6&&parts[3]==='lesson'&&lessonPattern.test(parts[4])
    &&(parts[5]==='overview'||parts[5]==='practice')){
   result.lessonId=parts[4];result.screen=parts[5];return result;
  }
  return result;
 }
 if(!FOUNDATION_VIEWS.has(view))return {view};
 if(parts.length===4&&parts[1]==='lesson'&&lessonPattern.test(parts[2])
   &&(parts[3]==='overview'||parts[3]==='practice'))
  return {view,lessonId:parts[2],screen:parts[3]};
 return {view};
}
export function browserRouteHash(route:BrowserRoute):string{
 let path='#/'+route.view;
 if(route.view==='writing-week'||route.view==='writing-later-week'){
  const first=route.view==='writing-week'?2:7,last=route.view==='writing-week'?6:12;
  if(Number.isInteger(route.writingWeek)&&route.writingWeek!>=first&&route.writingWeek!<=last
    &&route.writingStep&&writingSteps.has(route.writingStep))
   return path+'/'+route.writingWeek+'/'+route.writingStep;
 }
 if(route.view==='units'&&route.level&&levels.has(route.level)){
  path+='/'+route.level;
  if(route.unitId&&unitPattern.test(route.unitId)
    &&route.unitId.startsWith(route.level+'-'))path+='/'+route.unitId;
 }
 if(FOUNDATION_VIEWS.has(route.view)&&route.lessonId
  &&lessonPattern.test(route.lessonId)&&(route.view!=='units'||route.unitId))
  path+='/lesson/'+route.lessonId+'/'+(route.screen==='practice'?'practice':'overview');
 return path;
}
export function equalBrowserRoutes(a:BrowserRoute,b:BrowserRoute):boolean{
 return browserRouteHash(a)===browserRouteHash(b);
}
