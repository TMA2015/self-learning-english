import questions from "../content/questions-v4.json";
import tags from "../content/skills.json";
export type CoreSkill="Grammar"|"Vocabulary"|"Reading";
export type CoreQuestion={id:string;skill:CoreSkill;level:"A1"|"A2"|"B1"|"B2";tag:string;prompt:string;passage?:string;options:[string,string,string];correct:number;hintVi:string};
export const coreCatalog=tags;
export const canonical=(tag:string)=>({tense:"tense-and-aspect",agreement:"subject-verb-agreement",range:"vocabulary-range"}[tag]??tag);
export const coreBank=questions as CoreQuestion[];
