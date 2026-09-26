CREATE TABLE `assessment_sessions` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`session_id` text NOT NULL,
	`payload` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `session_id`)
);
--> statement-breakpoint
CREATE TABLE `learners` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`)
);
--> statement-breakpoint
CREATE TABLE `learning_evidence` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`event_id` text NOT NULL,
	`skill` text NOT NULL,
	`source` text NOT NULL,
	`payload` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `event_id`)
);
--> statement-breakpoint
CREATE INDEX `evidence_owner_learner_time` ON `learning_evidence` (`owner_id`,`learner_id`,`at`);--> statement-breakpoint
CREATE TABLE `mastery_snapshots` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`snapshot_id` text NOT NULL,
	`engine_version` text NOT NULL,
	`payload` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `snapshot_id`)
);
--> statement-breakpoint
CREATE INDEX `snapshots_owner_learner_time` ON `mastery_snapshots` (`owner_id`,`learner_id`,`at`);