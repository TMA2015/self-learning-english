import course from "../content/writing-course.json";
import {PILOT_WEEKS} from "../domain/writing-course-v2";
export const weeks=PILOT_WEEKS.map(w=>({...w,focus:w.title,lessons:[w.learn,w.guided,w.main]}));
export const {task,stages,skillLabels,demoHistory}=course;
