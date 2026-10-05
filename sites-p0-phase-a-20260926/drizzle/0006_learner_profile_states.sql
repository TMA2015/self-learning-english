CREATE TABLE `learner_profile_states` (
  `owner_id` text NOT NULL,
  `learner_id` text NOT NULL,
  `payload` text NOT NULL,
  `updated_at` integer NOT NULL,
  PRIMARY KEY(`owner_id`, `learner_id`)
);
