CREATE UNIQUE INDEX `gm_attendance_user_date_unique` ON `gm_attendance` (`user_id`,`work_date`);--> statement-breakpoint
CREATE INDEX `gm_attendance_date_idx` ON `gm_attendance` (`work_date`);--> statement-breakpoint
CREATE INDEX `gm_task_updates_task_idx` ON `gm_task_updates` (`task_id`);--> statement-breakpoint
CREATE INDEX `gm_tasks_department_idx` ON `gm_tasks` (`department`);--> statement-breakpoint
CREATE INDEX `gm_tasks_assignee_idx` ON `gm_tasks` (`assignee_id`);