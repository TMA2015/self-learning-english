import type {Evidence} from './learning-model';

export const GUIDED_CHECK_LABEL='Guided Check (Basic Structure)';
export const GUIDED_CHECK_DISCLAIMER='This check verifies required parts and words. It does not evaluate full meaning or grammar accuracy.';
export const ANALYSIS_LABELS=['Topic','Task / Action','Must Include','Boundary / Stay on Target','Off-topic idea to avoid'] as const;
// Retain legacy storage keys; labels are an additive presentation adapter.
export const ANALYSIS_FIELDS=['topic','task','keywords','limits','offtopic'] as const;
export type HelperItem={status:'good'|'needs-work'|'missing';label:string;evidence:string;explanation:string;nextAction:string;hint?:string;starter?:string};
export function analysisHelper(answer:Record<string,string>):HelperItem[]{
 const rules=[
  {key:'topic',label:ANALYSIS_LABELS[0],test:(s:string)=>/\bgarden\b/i.test(s)&&/\bschools?\b/i.test(s),explanation:'The words “school” and “garden” are present. Check that they name the subject.',next:'Name the subject using school and garden.',starter:'The topic is …'},
  {key:'task',label:ANALYSIS_LABELS[1],test:(s:string)=>/\b(agree|disagree|opinion)\b/i.test(s)&&/\breasons?\b/i.test(s),explanation:'An opinion word and “reason” are present. Check that you described both actions.',next:'Include stating your opinion and giving reasons.',starter:'I need to say whether … and give …'},
  {key:'keywords',label:ANALYSIS_LABELS[2],test:(s:string)=>/\breasons?\b/i.test(s)&&/\bexamples?\b/i.test(s),explanation:'“Reason” and “example” are present. Check that both required parts are listed.',next:'List reasons and an example as required parts.',starter:'My response must include …'},
  {key:'limits',label:ANALYSIS_LABELS[3],test:(s:string)=>/\bschools?\b/i.test(s)&&/\bgarden\b/i.test(s),explanation:'The context words “school” and “garden” are present. Check their meaning yourself.',next:'Name the school-garden context you must stay within.',starter:'I should stay focused on …'},
 ];
 return rules.map(r=>{const text=(answer[r.key]??'').trim();const status=!text?'missing':r.test(text)?'good':'needs-work';return {status,label:r.label,evidence:text?text.slice(0,100):'No response yet.',explanation:status==='good'?r.explanation:status==='missing'?'This required part is empty.':'The listed words were not all found. You may have used different words; check the required parts yourself. This is not a meaning judgment.',nextAction:status==='good'?'Read your words against the prompt; confirm that they mean what you intended.':r.next,starter:r.starter}});
}

export const GUIDED_PROMPT='Your class can choose one activity for a Friday reading club. Suggest an activity. Give one reason and one example of how classmates can take part.';
export const GUIDED_ITEMS=[
 {id:'WCV2-W1-G1',label:'Topic',question:'What is the topic?',options:['A Friday reading-club activity','A family holiday','The price of school lunches'],correct:0,explanation:'The prompt asks about an activity for the class reading club.'},
 {id:'WCV2-W1-G2',label:'Task / Action',question:'What must you do?',options:['Describe every book in the library','Suggest an activity and support your suggestion','Tell a story about a holiday'],correct:1,explanation:'“Suggest” asks you to propose an activity; the next sentence asks for support.'},
 {id:'WCV2-W1-G3',label:'Must Include',question:'Which support is explicitly required?',options:['Three famous authors','A price and a shopping list','One reason and one example of classmates taking part'],correct:2,explanation:'The prompt explicitly asks for one reason and one participation example.'},
 {id:'WCV2-W1-G4',label:'Boundary / Stay on Target',question:'Which idea crosses the Boundary?',options:['Classmates share a short book recommendation','My family bought a new sofa last weekend','Pairs act out a scene from a book'],correct:1,explanation:'Buying a family sofa is outside the class reading-club activity context.'},
] as const;
export type GuidedRecord={id:string;questionId:string;attempt:1|2;answer:number;correct:boolean;score:number;max:1;at:number;evidenceWeight:1;proficiencyWeight:0;tag:'writing.task_understanding';kind:'practice';contentVersion:'wcv2-a.1'};
export function checkGuided(records:GuidedRecord[],id:string,answer:number,at=Date.now()):GuidedRecord{
 const item=GUIDED_ITEMS.find(q=>q.id===id);if(!item||!Number.isInteger(answer)||answer<0||answer>=item.options.length)throw Error('Choose one answer first.');
 const previous=records.filter(r=>r.questionId===id);
 if(previous.some(r=>r.correct)||previous.length>=2)throw Error('This item is finished. Read its explanation and continue.');
 const attempt=(previous.length+1) as 1|2;const correct=answer===item.correct;
 return {id:`${id}:${attempt}`,questionId:id,attempt,answer,correct,score:Number(correct),max:1,at,evidenceWeight:1,proficiencyWeight:0,tag:'writing.task_understanding',kind:'practice',contentVersion:'wcv2-a.1'};
}
export function guidedProgress(records:GuidedRecord[]){
 const valid=records.filter(r=>r.evidenceWeight===1&&r.kind==='practice'&&GUIDED_ITEMS.some(q=>q.id===r.questionId));
 const unique=[...new Map(valid.map(r=>[r.id,r])).values()];
 return {correct:unique.filter(r=>r.correct).length,total:unique.length,finished:GUIDED_ITEMS.filter(q=>unique.some(r=>r.questionId===q.id&&(r.correct||r.attempt===2))).length};
}
export type PilotState={guided:GuidedRecord[];reflections:{topic:string;task:string;boundary:string};submission?:{signature:string;at:number};reviewDone?:boolean};
export const emptyPilot=():PilotState=>({guided:[],reflections:{topic:'',task:'',boundary:''}});
export type ProcessWork={analysis:Record<string,string>;brainstorm:Record<string,string>;outline:Record<string,string>;writing:string;completed:number[]};
export function workSignature(work:ProcessWork){return JSON.stringify([work.analysis,work.brainstorm,work.outline,work.writing]);}
export function completeOwnAttempt(work:ProcessWork){return [0,1,2,3].every(i=>work.completed.includes(i))&&[work.analysis,work.brainstorm,work.outline].every(g=>Object.values(g).every(s=>typeof s==='string'&&!!s.trim()))&&work.writing.trim().split(/\s+/).filter(Boolean).length>=35;}
export function canCompareModel(work:ProcessWork,pilot:PilotState,screen:string){return screen==='review'&&completeOwnAttempt(work)&&pilot.submission?.signature===workSignature(work);}
// New pilot process events measure saved activity only; never grade free-form language.
export function pilotProgressEvidence(stage:number,answer:Record<string,string>,at=Date.now()):Evidence[]{
 let h=2166136261;for(const c of JSON.stringify(answer))h=Math.imul(h^c.charCodeAt(0),16777619);
 return [{id:`wcv2-process-${stage}-${(h>>>0).toString(36)}`,source:'writing',activityId:`wcv2-process-${stage}`,skill:'Writing',tag:'writing-process-progress',score:0,max:1,at,mode:'rubric',provisional:true,detail:'Progress only. Deterministic proficiency evidence weight = 0; language review is required.',raw:{stage,answer,proficiencyWeight:0,evidenceWeight:0,kind:'progress'}}];
}

export const PILOT_WEEKS=[
 {title:'Prompt Analysis',goal:'Identify Topic, Task, Must Include and Boundary.',learn:'Read the four prompt parts',guided:'Identify parts of a new prompt',main:'Garden challenge',vi:'Phân tích đề',scaffold:'Full planning support'},
 {title:'Brainstorming & Relevance',goal:'Generate ideas and choose ones that answer the task.',learn:'Ideas and relevance',guided:'Off-Topic Spotter',main:'Select ideas for a response',vi:'Tìm ý và bám sát đề',scaffold:'Full planning support'},
 {title:'Idea Development & Reasons',goal:'Explain why an idea matters.',learn:'Opinion and reason',guided:'Add a reason',main:'Develop your own reason',vi:'Phát triển ý và lý do',scaffold:'Guided planning'},
 {title:'Examples & Details',goal:'Support a reason with a specific example.',learn:'Specific supporting details',guided:'Connect example to reason',main:'Develop a supporting example',vi:'Ví dụ và chi tiết',scaffold:'Guided planning'},
 {title:'Sentence Clarity & Linkers',goal:'Connect clear thoughts with simple linkers.',learn:'Because, so, but and although',guided:'Join two ideas',main:'Write connected sentences',vi:'Câu rõ nghĩa và từ nối',scaffold:'Guided planning'},
 {title:'Outlining & Response Structure',goal:'Plan an opening, support and ending.',learn:'Response structure',guided:'Order an outline',main:'Plan your own response',vi:'Dàn ý và cấu trúc',scaffold:'Optional planning prompts'},
 {title:'Paragraph Construction',goal:'Build one connected paragraph.',learn:'Topic sentence and support',guided:'Build a paragraph',main:'Write a supported paragraph',vi:'Xây dựng đoạn văn',scaffold:'Optional planning prompts'},
 {title:'Connecting Ideas & Paragraphs',goal:'Help readers follow ideas across paragraphs.',learn:'Transitions and flow',guided:'Choose a useful transition',main:'Connect two short paragraphs',vi:'Nối ý và đoạn văn',scaffold:'Optional planning prompts'},
 {title:'Applied Grammar & Self-Editing',goal:'Check agreement, tense and articles in a draft.',learn:'Grammar inside your writing',guided:'Edit selected draft sentences',main:'Self-edit your own draft',vi:'Ngữ pháp và tự chỉnh sửa',scaffold:'Checklist support'},
 {title:'Draft Revision & Self-Correction',goal:'Improve Task, Ideas, Sentences and Words.',learn:'Four-point revision checklist',guided:'Plan a targeted revision',main:'Revise your own response',vi:'Sửa bản nháp',scaffold:'Checklist support'},
 {title:'Guided Multi-Paragraph Challenge',goal:'Write a supported response of about 100–140 words.',learn:'Combine planning and paragraphs',guided:'Use a short planning checklist',main:'Multi-paragraph challenge',vi:'Thử thách nhiều đoạn',scaffold:'Reduced scaffolding'},
 {title:'Independent Writing',goal:'Plan, write and revise about 120–150 words independently.',learn:'Choose your own process',guided:'Optional planning scratchpad',main:'Independent response',vi:'Viết độc lập',scaffold:'Minimal scaffolding'},
] as const;
export const FOUNDATIONS=[
 {id:'task',title:'Understand the Task',concept:'Separate the subject from the action and required parts.',example:'“Suggest a class activity and give one reason”: activity is the topic; suggest is the action.',mistake:'Naming only the subject and forgetting what you must do.',week:0},
 {id:'ideas',title:'Build Ideas',concept:'List a few possible ideas before choosing one.',example:'For a reading club: share book recommendations; act out a scene.',mistake:'Copying the first idea you see instead of thinking of your own.',week:1},
 {id:'develop',title:'Develop Ideas',concept:'Ask “Why?” and add one supporting detail.',example:'Reading together helps us share ideas because we hear different opinions.',mistake:'Repeating “It is good” without explaining why.',week:2},
 {id:'organize',title:'Organize Writing',concept:'Put your point before its supporting reason and example.',example:'Point → reason → example → ending.',mistake:'Adding unrelated details between a reason and its example.',week:5},
 {id:'sentences',title:'Write Clear Sentences',concept:'Express one main thought, then connect it when helpful.',example:'We shared a book, so everyone could join the discussion.',mistake:'Joining many ideas without punctuation or a useful linker.',week:4},
 {id:'revise',title:'Revise & Self-Edit',concept:'Check the task and ideas before fixing individual words.',example:'First check: “Did I give the reason requested?” Then edit one sentence.',mistake:'Changing words while leaving a required part missing.',week:9},
] as const;
export type PilotRoute='overview'|'foundations'|'learn'|'guided'|'main'|'review'|'course';
