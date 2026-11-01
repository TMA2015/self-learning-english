import items from "../content/listening-v4.json";
export type ListeningTask={id:string;tag:string;level:"A1"|"A2"|"B1";text:string;prompt:string;options:string[];correct:number};
export const coreListening=items as ListeningTask[];
