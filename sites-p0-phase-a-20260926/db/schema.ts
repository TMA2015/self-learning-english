import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core";
export const learnerStates = sqliteTable("learner_states", {
  userId: text("user_id").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// The owner scope is always supplied by trusted Site identity, never by client JSON.
export const learners = sqliteTable("learners", {
 ownerId:text("owner_id").notNull(), learnerId:text("learner_id").notNull(), legacyImported:integer("legacy_imported").notNull().default(0), createdAt:integer("created_at").notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId]})]);
export const learningEvidence = sqliteTable("learning_evidence", {
 ownerId:text("owner_id").notNull(), learnerId:text("learner_id").notNull(), eventId:text("event_id").notNull(),
 skill:text("skill").notNull(), source:text("source").notNull(), payload:text("payload").notNull(), at:integer("at").notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.eventId]}),index("evidence_owner_learner_time").on(t.ownerId,t.learnerId,t.at)]);
export const assessmentSessions = sqliteTable("assessment_sessions", {
 ownerId:text("owner_id").notNull(), learnerId:text("learner_id").notNull(), sessionId:text("session_id").notNull(), payload:text("payload").notNull(), at:integer("at").notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.sessionId]})]);
export const masterySnapshots = sqliteTable("mastery_snapshots", {
 ownerId:text("owner_id").notNull(), learnerId:text("learner_id").notNull(), snapshotId:text("snapshot_id").notNull(), engineVersion:text("engine_version").notNull(), payload:text("payload").notNull(), at:integer("at").notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.snapshotId]}),index("snapshots_owner_learner_time").on(t.ownerId,t.learnerId,t.at)]);

export const writingSubmissions=sqliteTable('writing_submissions',{
 ownerId:text('owner_id').notNull(),learnerId:text('learner_id').notNull(),id:text('id').notNull(),taskId:text('task_id').notNull(),payload:text('payload').notNull(),at:integer('at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.id]}),index('writing_submission_scope_time').on(t.ownerId,t.learnerId,t.at)]);
export const writingEvaluations=sqliteTable('writing_evaluations',{
 ownerId:text('owner_id').notNull(),learnerId:text('learner_id').notNull(),id:text('id').notNull(),submissionId:text('submission_id').notNull(),status:text('status').notNull(),payload:text('payload').notNull(),at:integer('at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.id]}),index('writing_evaluation_scope_submission').on(t.ownerId,t.learnerId,t.submissionId)]);

export const assistedReviewPackets=sqliteTable('assisted_review_packets',{
 ownerId:text('owner_id').notNull(),learnerId:text('learner_id').notNull(),id:text('id').notNull(),submissionId:text('submission_id').notNull(),payload:text('payload').notNull(),at:integer('at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.id]})]);
export const writingApprovals=sqliteTable('writing_approvals',{
 ownerId:text('owner_id').notNull(),learnerId:text('learner_id').notNull(),submissionId:text('submission_id').notNull(),evaluationId:text('evaluation_id').notNull(),reviewedBy:text('reviewed_by').notNull(),at:integer('at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.submissionId]})]);

// Shared versioned instructional content; never a learner profile.
export const academicPackages=sqliteTable('academic_packages',{
 packageId:text('package_id').notNull(),version:text('version').notNull(),digest:text('digest').notNull(),payload:text('payload').notNull(),at:integer('at').notNull(),
},t=>[primaryKey({columns:[t.packageId,t.version]})]);
export const academicAttempts=sqliteTable('academic_attempts',{
 ownerId:text('owner_id').notNull(),learnerId:text('learner_id').notNull(),id:text('id').notNull(),lessonId:text('lesson_id').notNull(),version:text('version').notNull(),status:text('status').notNull(),payload:text('payload').notNull(),at:integer('at').notNull(),
},t=>[primaryKey({columns:[t.ownerId,t.learnerId,t.id]})]);
