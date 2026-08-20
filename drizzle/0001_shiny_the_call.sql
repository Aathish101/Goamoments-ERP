CREATE TABLE `gm_attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`work_date` text NOT NULL,
	`clock_in` text NOT NULL,
	`clock_out` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gm_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gm_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gm_task_updates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`status` text NOT NULL,
	`progress` integer NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gm_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`department` text NOT NULL,
	`assignee_id` text NOT NULL,
	`assigned_by_id` text NOT NULL,
	`due_at` text NOT NULL,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`status` text DEFAULT 'To do' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`latest_update` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE TABLE `gm_user_departments` (
	`user_id` text NOT NULL,
	`department` text NOT NULL,
	`is_primary` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `department`)
);
--> statement-breakpoint
CREATE TABLE `gm_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`title` text NOT NULL,
	`primary_department` text,
	`initials` text NOT NULL,
	`password_salt` text NOT NULL,
	`password_hash` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gm_users_username_unique` ON `gm_users` (`username`);--> statement-breakpoint
DROP TABLE `attendance`;--> statement-breakpoint
DROP TABLE `tasks`;