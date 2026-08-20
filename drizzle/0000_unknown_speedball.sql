CREATE TABLE `attendance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee` text NOT NULL,
	`state` text NOT NULL,
	`recorded_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`project` text NOT NULL,
	`assignee` text NOT NULL,
	`initials` text NOT NULL,
	`due` text NOT NULL,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`status` text DEFAULT 'To do' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
