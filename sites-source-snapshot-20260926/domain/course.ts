/** Portable content and progress vocabulary; independent of UI and hosting. */
export type LessonDefinition={id:string;title:string;skillTags:string[];stages:string[]};
export type CourseDefinition={id:string;version:string;title:string;weeks:{title:string;focus:string;lessons:string[]}[]};
export type CourseProgress={courseId:string;week:number;stage:number;completed:number[]};
export type LearnerPreferences={name:string;grade:string;goal:string;minutes:string};
