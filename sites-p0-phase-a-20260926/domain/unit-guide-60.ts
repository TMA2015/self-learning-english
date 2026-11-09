import authoredUnits from '../content/sle-unit-catalog-v1.json';
import primaryAssignments from '../content/sle-unit-navigation-map-v1.json';

/**
 * Unit navigation is a read-only index over the CURRENT course catalog.
 * It never clones lessons, writes a learner record or invents assessments.
 * Titles and IDs come from the approved SLE CEFR framework.
 */
export type UnitLevel='A1'|'A2'|'B1'|'B2'|'C1'|'C2';
export type UnitCatalogLesson={id:string;title:string;module:string;cefr:string;minutes:number};
export type UnitGuideItem={
 id:string;title:string;level:UnitLevel;lessons:UnitCatalogLesson[];
 lessonCount:number;available:boolean;isCheckpoint:boolean;
};
export type UnitGuide={
 units:UnitGuideItem[];
 mappedLessonCount:number;
 unmappedLessons:UnitCatalogLesson[];
 levels:UnitLevel[];
};
const assignments:Record<string,string>={
 ...primaryAssignments.baseline,
 ...primaryAssignments.conditional_v119,
 ...primaryAssignments.confirmed_v121,
 ...primaryAssignments.confirmed_v122,
};
export const UNIT_LEVELS:UnitLevel[]=['A1','A2','B1','B2','C1','C2'];
export const UNIT_DEFINITIONS=authoredUnits.units;
export function primaryUnitForLessonId(lessonId:string):string|undefined{
 return assignments[lessonId];
}
export function unitGuideForCatalog(
 lessons:readonly UnitCatalogLesson[],
 courseOrder:readonly string[]=[]
):UnitGuide{
 const unique=new Map<string,UnitCatalogLesson>();
 for(const lesson of lessons){
  if(!lesson?.id||!lesson.title||unique.has(lesson.id))
   throw Error('Available course has an invalid or duplicate Lesson ID.');
  unique.set(lesson.id,lesson);
 }
 const orderIndex=new Map(courseOrder.map((id,index)=>[id,index]));
 const byOrder=(a:UnitCatalogLesson,b:UnitCatalogLesson)=>
  (orderIndex.get(a.id)??Number.MAX_SAFE_INTEGER)-
  (orderIndex.get(b.id)??Number.MAX_SAFE_INTEGER)||
  a.id.localeCompare(b.id);
 const units:UnitGuideItem[]=UNIT_DEFINITIONS.map(def=>{
  const items=lessons.filter(l=>assignments[l.id]===def.id).sort(byOrder);
  return {
   id:def.id,title:def.title,level:def.id.slice(0,2) as UnitLevel,
   lessons:items,lessonCount:items.length,available:items.length>0,
   isCheckpoint:def.id.endsWith('-U10')
  };
 });
 const known=new Set(units.map(u=>u.id));
 const unmappedLessons=lessons.filter(l=>!known.has(assignments[l.id])).sort(byOrder);
 const mappedLessonCount=units.reduce((n,u)=>n+u.lessonCount,0);
 if(mappedLessonCount+unmappedLessons.length!==unique.size)
  throw Error('Unit mapping must preserve every available Lesson ID exactly once.');
 return {units,mappedLessonCount,unmappedLessons,levels:UNIT_LEVELS};
}
