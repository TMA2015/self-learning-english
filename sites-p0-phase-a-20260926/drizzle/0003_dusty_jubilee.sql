CREATE TABLE `writing_evaluations` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`id` text NOT NULL,
	`submission_id` text NOT NULL,
	`status` text NOT NULL,
	`payload` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `id`)
);
--> statement-breakpoint
CREATE INDEX `writing_evaluation_scope_submission` ON `writing_evaluations` (`owner_id`,`learner_id`,`submission_id`);--> statement-breakpoint
CREATE TABLE `writing_submissions` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`id` text NOT NULL,
	`task_id` text NOT NULL,
	`payload` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `id`)
);
--> statement-breakpoint
CREATE INDEX `writing_submission_scope_time` ON `writing_submissions` (`owner_id`,`learner_id`,`at`);