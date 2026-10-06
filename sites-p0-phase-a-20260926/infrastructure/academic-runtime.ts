import {academicService} from '../application/academic-service';
import type {Scope} from '../domain/repository';
import {D1AcademicRepository} from './storage/d1-academic';
import {D1LearningRepository} from './storage/d1-repository';
import {runtimeConfig} from './runtime';

export function accountAcademic(scope:Scope){
 const {DB}=runtimeConfig();
 return academicService(new D1AcademicRepository(DB),new D1LearningRepository(DB),scope);
}
