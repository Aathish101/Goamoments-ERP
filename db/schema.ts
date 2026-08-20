import { sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("gm_users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  title: text("title").notNull(),
  primaryDepartment: text("primary_department"),
  initials: text("initials").notNull(),
  passwordSalt: text("password_salt").notNull(),
  passwordHash: text("password_hash").notNull(),
  active: integer("active").notNull().default(1),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userDepartments = sqliteTable("gm_user_departments", {
  userId: text("user_id").notNull(),
  department: text("department").notNull(),
  isPrimary: integer("is_primary").notNull().default(0),
}, (table) => [primaryKey({ columns: [table.userId, table.department] })]);

export const tasks = sqliteTable("gm_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  department: text("department").notNull(),
  assigneeId: text("assignee_id").notNull(),
  assignedById: text("assigned_by_id").notNull(),
  dueAt: text("due_at").notNull(),
  priority: text("priority").notNull().default("Medium"),
  status: text("status").notNull().default("To do"),
  progress: integer("progress").notNull().default(0),
  latestUpdate: text("latest_update").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
}, (table) => [index("gm_tasks_department_idx").on(table.department), index("gm_tasks_assignee_idx").on(table.assigneeId)]);

export const taskUpdates = sqliteTable("gm_task_updates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id").notNull(),
  userId: text("user_id").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").notNull(),
  note: text("note").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("gm_task_updates_task_idx").on(table.taskId)]);

export const attendance = sqliteTable("gm_attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  workDate: text("work_date").notNull(),
  clockIn: text("clock_in").notNull(),
  clockOut: text("clock_out"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("gm_attendance_user_date_unique").on(table.userId, table.workDate), index("gm_attendance_date_idx").on(table.workDate)]);

export const sessions = sqliteTable("gm_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const meta = sqliteTable("gm_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
