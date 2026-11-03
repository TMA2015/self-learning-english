CREATE TABLE `assisted_review_packets` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`id` text NOT NULL,
	`submission_id` text NOT NULL,
	`payload` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `id`)
);
--> statement-breakpoint
CREATE TABLE `writing_approvals` (
	`owner_id` text NOT NULL,
	`learner_id` text NOT NULL,
	`submission_id` text NOT NULL,
	`evaluation_id` text NOT NULL,
	`reviewed_by` text NOT NULL,
	`at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `learner_id`, `submission_id`)
);
