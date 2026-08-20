export const DEPARTMENTS = ["Development", "BPO", "Documentation", "Marketing"] as const;
export type Department = (typeof DEPARTMENTS)[number];
export type Role = "DM" | "GM" | "LEAD" | "EMPLOYEE";

export type ERPUser = {
  id: string;
  username: string;
  name: string;
  role: Role;
  title: string;
  primaryDepartment: Department | null;
  initials: string;
  departments: Department[];
};

export type ERPTask = {
  id: number;
  title: string;
  description: string;
  department: Department;
  assigneeId: string;
  assigneeName: string;
  assigneeInitials: string;
  assignedById: string;
  assignedByName: string;
  dueAt: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To do" | "In progress" | "Review" | "Blocked" | "Completed";
  progress: number;
  latestUpdate: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

type SeedUser = Omit<ERPUser, "departments"> & {
  salt: string;
  hash: string;
  departments: Array<[Department, number]>;
};

// Cloudflare Workers currently accepts at most 100,000 PBKDF2 iterations.
// Keep this value shared by sign-in and password changes so hashes never drift.
const PASSWORD_HASH_ITERATIONS = 100_000;

// These are the original 120,000-iteration seed hashes. During initialization,
// only accounts that still have an untouched original hash are migrated. A user
// who already changed their password is therefore never reset by this repair.
const LEGACY_SEED_HASHES: Record<string, string> = {
  "GM-DM-001": "037bcbcc8a41425c36ace986e4e7a17d275731f546fa4a72c1ae1ef05b3e39fd",
  "GM-GM-001": "85acdf8ecb1c20a488a42f292fe5b1eae0bd3d4a8d9e00e9d65d576f3299f06f",
  "GM-DEV-001": "52a8113ecaa85224a20592ea161f5a3d08a89cb659139b35b3d55d8ea3ab0f5b",
  "GM-DEV-002": "e7d2cad310615ed56db4fe2035b4e4d5a6627845477cc305e6a3461eaf5cda37",
  "GM-DEV-003": "8099b7a80dec9cb6ffc678868aa598f45e9911183e59d415376159aa459f48d2",
  "GM-DEV-004": "d1addba5f022871a3e5b0be0be8fc20dad13be0cef1b5aa9653278cd4c141df5",
  "GM-DEV-005": "64cfd4e6ea197f8be8a34585102e99b102613af53b18a70be71bd4379f6ebc96",
  "GM-DEV-006": "ac43f42b14a8761216557b5d9222850d70b87704150415f7d53b678d7b5bb502",
  "GM-BPO-001": "d8feb600f790c4f0d3331866cf647f901f83389dbad5721dfcb6bf2bc19e247e",
  "GM-BPO-002": "299a52e6314af3849e1cb6ee6ab509e3e5d3a6806382b0931e81c5c022bde75b",
  "GM-BPO-003": "c6042b3c9c896a2cce90f4d9539d528dff0433ec5378b35aab4a68753949c618",
  "GM-BPO-004": "29f1c48cff1db76c41d725c73963a647e6c496e3761f6d19098c96615ba40196",
  "GM-DOC-001": "7f052a30dc1b72419ac78e04041f69841e2a4e5833898f9554694714bc5afd6b",
  "GM-MKT-001": "8a685e2df173d60ca504edce5a9149ee6b0608158a8c91d4ee42293340657b41",
  "GM-MKT-002": "d0c83f5ed114f9accca35c93b0ac6fc75b25dd6d06f6bab28bda993dfcaf5303",
  "GM-MKT-003": "ec04c2fd9b6b2a5522fe728129ab3ef8b78026fee6960f1543df9433fd7e16e3",
};

const ROSTER: SeedUser[] = [
  { id: "GM-DM-001", username: "dm.bupathiraj", name: "Bupathiraj", role: "DM", title: "DM", primaryDepartment: null, initials: "BR", salt: "7533125c65cde53960adee04d12cc026", hash: "3eec5775b97db1d88c9b7c161497bb33345a14390b1ddc585810078e8e7ea5ff", departments: [] },
  { id: "GM-GM-001", username: "gm.aathish", name: "Aathish", role: "GM", title: "General Manager", primaryDepartment: null, initials: "AA", salt: "4d99182739e3648ede291b70cd6b7cf8", hash: "85582bdafb0c7c2320a24a30715905ba4f8f255bcd0ffbd46480bad8c9b9aefe", departments: [] },
  { id: "GM-DEV-001", username: "lead.development", name: "Muthuselvam", role: "LEAD", title: "Development Lead", primaryDepartment: "Development", initials: "MS", salt: "068543b4e65c38aa835d7346ab04e1dd", hash: "6f572a26ffa86ad2c6c41912749a184a4ca74327a15201651e43c3e493a05e7d", departments: [["Development", 1]] },
  { id: "GM-DEV-002", username: "dev.kishore", name: "Kishore", role: "EMPLOYEE", title: "Development Team", primaryDepartment: "Development", initials: "KI", salt: "a869b0a43cd4e4c241ad871dd1b5241c", hash: "b9dc3978a3fad8e32563792b081ea8d54f357f77a7f9d5eb8127493fb1e16038", departments: [["Development", 1]] },
  { id: "GM-DEV-003", username: "dev.mahendaran", name: "Mahendaran", role: "EMPLOYEE", title: "Development Team", primaryDepartment: "Development", initials: "MA", salt: "c1a0d3ff721b378c91859c89f95c63bd", hash: "79c0e737379b0cc687d0025b90e3c5020f25d53f9e15da4da2df4f09267236fb", departments: [["Development", 1]] },
  { id: "GM-DEV-004", username: "dev.rahul", name: "Rahul", role: "EMPLOYEE", title: "Development Team", primaryDepartment: "Development", initials: "RA", salt: "78109b2fb880891deeb09405706048f6", hash: "ba5e7c46e0f23700ea4a8cc0652d30037d7946d1473f2036e69ed4784d369e2a", departments: [["Development", 1]] },
  { id: "GM-DEV-005", username: "dev.ram", name: "Ram", role: "EMPLOYEE", title: "Development Team", primaryDepartment: "Development", initials: "RM", salt: "e1979f8e0a157784c8d7596e41dc795f", hash: "0b4fa570114117771d9770c893f139a08109445eed40f64fc30a66f3b08a6e81", departments: [["Development", 1]] },
  { id: "GM-DEV-006", username: "dev.sahil", name: "Sahil", role: "EMPLOYEE", title: "Development Team", primaryDepartment: "Development", initials: "SA", salt: "36f84610e754884ec98671b4bb7f81d7", hash: "69d1c01eb2e9df650140fe80f3f7cc59642e4fec18212f2cae4905ddb5bcdf1b", departments: [["Development", 1]] },
  { id: "GM-BPO-001", username: "lead.bpo", name: "Lakshmi", role: "LEAD", title: "BPO Lead", primaryDepartment: "BPO", initials: "LA", salt: "1757831cbd83a5076c72a8478eb8e09c", hash: "e2f73acaf468f4f8bfe9696364b7d6f381356e03a5db28a71905fb3180c7021d", departments: [["BPO", 1]] },
  { id: "GM-BPO-002", username: "emp.archana", name: "Archana", role: "EMPLOYEE", title: "BPO & Documentation Executive", primaryDepartment: "BPO", initials: "AR", salt: "df8bb2ec2562824d1108ebb965ea79f2", hash: "9064f412c20278814641355a6a8cd5d568feead4481ea6e165a3ac97cc381e5d", departments: [["BPO", 1], ["Documentation", 0]] },
  { id: "GM-BPO-003", username: "bpo.natchathra", name: "Natchathra", role: "EMPLOYEE", title: "BPO Team", primaryDepartment: "BPO", initials: "NA", salt: "f56210725c2cc6582d3bf0f0a4a528ff", hash: "f9a2af0d6bd7cbac0c5a33dfd58decb0d8541daf7f8e8f7d2e3e6c5226797ab4", departments: [["BPO", 1]] },
  { id: "GM-BPO-004", username: "bpo.sudeshika", name: "Sudeshika", role: "EMPLOYEE", title: "BPO Team", primaryDepartment: "BPO", initials: "SU", salt: "6a035b94bd24a93f9be0c324b04acb6f", hash: "9e0e1cbbbbef1af3828c62b9f9807b59a65c6389ca97122ff6129b10d6ef3c31", departments: [["BPO", 1]] },
  { id: "GM-DOC-001", username: "lead.documentation", name: "Dhaya", role: "LEAD", title: "Documentation Lead", primaryDepartment: "Documentation", initials: "DH", salt: "4a56ff829b7e90885915c33b2f0843e1", hash: "db14b248abc30c1ccfeb4d11f6446b37fb895c4e7cf1369a90bf60979af5f4db", departments: [["Documentation", 1]] },
  { id: "GM-MKT-001", username: "lead.marketing", name: "Nagalakshmi", role: "LEAD", title: "Marketing Lead", primaryDepartment: "Marketing", initials: "NL", salt: "fd0a1b581651f4e9743436c1027bb84b", hash: "69f5785216ebdbcb243b64120c39df8ef316f0e347baa97ce8dac3160cb70ede", departments: [["Marketing", 1]] },
  { id: "GM-MKT-002", username: "marketing.srimathi", name: "Srimathi", role: "EMPLOYEE", title: "Marketing Team", primaryDepartment: "Marketing", initials: "SR", salt: "30751405e65dc98b9c3d95efea45cf50", hash: "420c38d04c19982cd81e568fe67c1b67c7d953411845138ad0eade302833e74d", departments: [["Marketing", 1]] },
  { id: "GM-MKT-003", username: "marketing.sandhiya", name: "Sandhiya", role: "EMPLOYEE", title: "Marketing Team", primaryDepartment: "Marketing", initials: "SN", salt: "1a67fc7da02a568d2003379dded2110e", hash: "9a1833cba74aab20c5a33dbbe3fc8e770920bb5f6c5fe4820d6cc933abc99bbd", departments: [["Marketing", 1]] },
];

type D1 = {
  prepare(query: string): {
    bind(...values: unknown[]): ReturnType<D1["prepare"]>;
    run(): Promise<unknown>;
    first<T>(): Promise<T | null>;
    all<T>(): Promise<{ results: T[] }>;
  };
  batch(statements: Array<ReturnType<D1["prepare"]>>): Promise<unknown>;
};

async function database(): Promise<D1> {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("Goa Moments ERP database is unavailable");
  return env.DB as unknown as D1;
}

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS gm_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS gm_users (
    id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, role TEXT NOT NULL,
    title TEXT NOT NULL, primary_department TEXT, initials TEXT NOT NULL, password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS gm_user_departments (
    user_id TEXT NOT NULL, department TEXT NOT NULL, is_primary INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, department)
  )`,
  `CREATE TABLE IF NOT EXISTS gm_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
    department TEXT NOT NULL, assignee_id TEXT NOT NULL, assigned_by_id TEXT NOT NULL, due_at TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium', status TEXT NOT NULL DEFAULT 'To do', progress INTEGER NOT NULL DEFAULT 0,
    latest_update TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, completed_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS gm_task_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT, task_id INTEGER NOT NULL, user_id TEXT NOT NULL,
    status TEXT NOT NULL, progress INTEGER NOT NULL, note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS gm_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, work_date TEXT NOT NULL,
    clock_in TEXT NOT NULL, clock_out TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, work_date)
  )`,
  `CREATE TABLE IF NOT EXISTS gm_sessions (
    token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS gm_tasks_department_idx ON gm_tasks (department)`,
  `CREATE INDEX IF NOT EXISTS gm_tasks_assignee_idx ON gm_tasks (assignee_id)`,
  `CREATE INDEX IF NOT EXISTS gm_attendance_date_idx ON gm_attendance (work_date)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS gm_attendance_user_date_unique ON gm_attendance (user_id, work_date)`,
  `CREATE INDEX IF NOT EXISTS gm_task_updates_task_idx ON gm_task_updates (task_id)`,
];

let initialization: Promise<void> | null = null;

export async function ensureErpDatabase() {
  if (!initialization) {
    initialization = initializeErpDatabase().catch((error) => {
      initialization = null;
      throw error;
    });
  }
  return initialization;
}

async function initializeErpDatabase() {
  const db = await database();
  for (const statement of schemaStatements) await db.prepare(statement).run();

  const reset = await db.prepare("SELECT value FROM gm_meta WHERE key = ?").bind("fresh_goa_moments_erp_v2").first<{ value: string }>();
  if (!reset) {
    await db.prepare("DROP TABLE IF EXISTS tasks").run();
    await db.prepare("DROP TABLE IF EXISTS attendance").run();
    await db.prepare("INSERT OR IGNORE INTO gm_meta (key, value) VALUES (?, ?)").bind("fresh_goa_moments_erp_v2", new Date().toISOString()).run();
  }

  for (const user of ROSTER) {
    await db.prepare(`INSERT INTO gm_users (
      id, username, name, role, title, primary_department, initials, password_salt, password_hash, active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO UPDATE SET username=excluded.username, name=excluded.name, role=excluded.role,
      title=excluded.title, primary_department=excluded.primary_department, initials=excluded.initials, active=1`)
      .bind(user.id, user.username, user.name, user.role, user.title, user.primaryDepartment, user.initials, user.salt, user.hash).run();
    const legacyHash = LEGACY_SEED_HASHES[user.id];
    if (legacyHash) {
      await db.prepare("UPDATE gm_users SET password_salt = ?, password_hash = ? WHERE id = ? AND password_hash = ?")
        .bind(user.salt, user.hash, user.id, legacyHash).run();
    }
    for (const [department, isPrimary] of user.departments) {
      await db.prepare("INSERT OR REPLACE INTO gm_user_departments (user_id, department, is_primary) VALUES (?, ?, ?)")
        .bind(user.id, department, isPrimary).run();
    }
  }
}

function rowToUser(row: Record<string, unknown>, departments: Department[] = []): ERPUser {
  return {
    id: String(row.id), username: String(row.username), name: String(row.name), role: row.role as Role,
    title: String(row.title), primaryDepartment: (row.primary_department as Department | null) ?? null,
    initials: String(row.initials), departments,
  };
}

async function departmentsFor(userId: string): Promise<Department[]> {
  const db = await database();
  const rows = await db.prepare("SELECT department FROM gm_user_departments WHERE user_id = ? ORDER BY is_primary DESC, department")
    .bind(userId).all<{ department: Department }>();
  return rows.results.map((row) => row.department);
}

export async function findUserByUsername(username: string) {
  await ensureErpDatabase();
  const db = await database();
  return db.prepare("SELECT * FROM gm_users WHERE lower(username) = lower(?) AND active = 1").bind(username).first<Record<string, unknown>>();
}

export async function getUserById(id: string): Promise<ERPUser | null> {
  await ensureErpDatabase();
  const db = await database();
  const row = await db.prepare("SELECT * FROM gm_users WHERE id = ? AND active = 1").bind(id).first<Record<string, unknown>>();
  return row ? rowToUser(row, await departmentsFor(id)) : null;
}

export async function listUsers(): Promise<ERPUser[]> {
  await ensureErpDatabase();
  const db = await database();
  const rows = await db.prepare(`SELECT u.*, GROUP_CONCAT(d.department, '|') AS departments
    FROM gm_users u LEFT JOIN gm_user_departments d ON d.user_id = u.id
    WHERE u.active = 1 GROUP BY u.id
    ORDER BY CASE u.role WHEN 'DM' THEN 1 WHEN 'GM' THEN 2 WHEN 'LEAD' THEN 3 ELSE 4 END, u.name`).all<Record<string, unknown>>();
  return rows.results.map((row) => rowToUser(row, row.departments ? String(row.departments).split("|") as Department[] : []));
}

export function isLeadership(user: ERPUser) {
  return user.role === "DM" || user.role === "GM";
}

export function canManageDepartment(user: ERPUser, department: Department) {
  return isLeadership(user) || (user.role === "LEAD" && user.departments.includes(department));
}

export async function listTasksFor(user: ERPUser): Promise<ERPTask[]> {
  await ensureErpDatabase();
  const db = await database();
  let where = "";
  const values: unknown[] = [];
  if (user.role === "LEAD") {
    where = `WHERE t.department IN (${user.departments.map(() => "?").join(",")})`;
    values.push(...user.departments);
  } else if (user.role === "EMPLOYEE") {
    where = "WHERE t.assignee_id = ?";
    values.push(user.id);
  }
  const result = await db.prepare(`SELECT t.id, t.title, t.description, t.department, t.assignee_id, au.name AS assignee_name,
    au.initials AS assignee_initials, t.assigned_by_id, bu.name AS assigned_by_name, t.due_at, t.priority,
    t.status, t.progress, t.latest_update, t.created_at, t.updated_at, t.completed_at
    FROM gm_tasks t JOIN gm_users au ON au.id = t.assignee_id JOIN gm_users bu ON bu.id = t.assigned_by_id
    ${where} ORDER BY CASE t.status WHEN 'Blocked' THEN 1 WHEN 'Review' THEN 2 WHEN 'In progress' THEN 3 WHEN 'To do' THEN 4 ELSE 5 END, t.due_at`)
    .bind(...values).all<Record<string, unknown>>();
  return result.results.map((row) => ({
    id: Number(row.id), title: String(row.title), description: String(row.description), department: row.department as Department,
    assigneeId: String(row.assignee_id), assigneeName: String(row.assignee_name), assigneeInitials: String(row.assignee_initials),
    assignedById: String(row.assigned_by_id), assignedByName: String(row.assigned_by_name), dueAt: String(row.due_at),
    priority: row.priority as ERPTask["priority"], status: row.status as ERPTask["status"], progress: Number(row.progress),
    latestUpdate: String(row.latest_update), createdAt: String(row.created_at), updatedAt: String(row.updated_at),
    completedAt: row.completed_at ? String(row.completed_at) : null,
  }));
}

export async function listAllTasks(): Promise<ERPTask[]> {
  const leadership = { id: "system", role: "DM", departments: [] } as unknown as ERPUser;
  return listTasksFor(leadership);
}

export async function createTask(actor: ERPUser, input: {
  title: string; description: string; department: Department; assigneeId: string; dueAt: string; priority: ERPTask["priority"];
}) {
  if (!canManageDepartment(actor, input.department)) throw new Error("You cannot assign work outside your department");
  const assignee = await getUserById(input.assigneeId);
  if (!assignee || !assignee.departments.includes(input.department)) throw new Error("The selected employee is not part of this department");
  const db = await database();
  const row = await db.prepare(`INSERT INTO gm_tasks (
    title, description, department, assignee_id, assigned_by_id, due_at, priority, status, progress, latest_update
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'To do', 0, '') RETURNING id`)
    .bind(input.title.trim(), input.description.trim(), input.department, input.assigneeId, actor.id, input.dueAt, input.priority)
    .first<{ id: number }>();
  if (!row) throw new Error("The task could not be created");
  await db.prepare("INSERT INTO gm_task_updates (task_id, user_id, status, progress, note) VALUES (?, ?, 'To do', 0, ?)")
    .bind(row.id, actor.id, "Task assigned").run();
  return row.id;
}

export async function updateTask(actor: ERPUser, input: { id: number; status: ERPTask["status"]; progress: number; note: string }) {
  const db = await database();
  const task = await db.prepare("SELECT id, assignee_id, department FROM gm_tasks WHERE id = ?").bind(input.id)
    .first<{ id: number; assignee_id: string; department: Department }>();
  if (!task) throw new Error("Task not found");
  const allowed = isLeadership(actor) || canManageDepartment(actor, task.department) || task.assignee_id === actor.id;
  if (!allowed) throw new Error("You cannot update this task");
  const progress = Math.max(0, Math.min(100, Math.round(input.progress)));
  const status = input.status === "Completed" ? "Completed" : input.status;
  const finalProgress = status === "Completed" ? 100 : progress;
  const completedAt = status === "Completed" ? new Date().toISOString() : null;
  await db.prepare(`UPDATE gm_tasks SET status = ?, progress = ?, latest_update = ?, updated_at = CURRENT_TIMESTAMP,
    completed_at = ? WHERE id = ?`).bind(status, finalProgress, input.note.trim(), completedAt, input.id).run();
  await db.prepare("INSERT INTO gm_task_updates (task_id, user_id, status, progress, note) VALUES (?, ?, ?, ?, ?)")
    .bind(input.id, actor.id, status, finalProgress, input.note.trim()).run();
}

export function indiaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export async function attendanceAction(user: ERPUser, action: "clock_in" | "clock_out") {
  await ensureErpDatabase();
  const db = await database();
  const workDate = indiaDateKey();
  const current = await db.prepare("SELECT id, clock_in, clock_out FROM gm_attendance WHERE user_id = ? AND work_date = ?")
    .bind(user.id, workDate).first<{ id: number; clock_in: string; clock_out: string | null }>();
  if (action === "clock_in") {
    if (current?.clock_in) throw new Error(current.clock_out ? "Attendance is already completed for today" : "You are already clocked in");
    await db.prepare("INSERT INTO gm_attendance (user_id, work_date, clock_in) VALUES (?, ?, ?)")
      .bind(user.id, workDate, new Date().toISOString()).run();
  } else {
    if (!current?.clock_in) throw new Error("Clock in before clocking out");
    if (current.clock_out) throw new Error("You already clocked out today");
    await db.prepare("UPDATE gm_attendance SET clock_out = ? WHERE id = ?").bind(new Date().toISOString(), current.id).run();
  }
}

export type AttendanceRow = {
  id: number; userId: string; name: string; initials: string; title: string; department: Department | null;
  workDate: string; clockIn: string; clockOut: string | null;
};

export async function listAttendanceFor(user: ERPUser, workDate = indiaDateKey()): Promise<AttendanceRow[]> {
  await ensureErpDatabase();
  const db = await database();
  let where = "WHERE a.work_date = ?";
  const values: unknown[] = [workDate];
  if (user.role === "LEAD") {
    where += ` AND EXISTS (SELECT 1 FROM gm_user_departments ud WHERE ud.user_id = u.id AND ud.department IN (${user.departments.map(() => "?").join(",")}))`;
    values.push(...user.departments);
  } else if (user.role === "EMPLOYEE") {
    where += " AND a.user_id = ?";
    values.push(user.id);
  }
  const rows = await db.prepare(`SELECT a.id, a.user_id, u.name, u.initials, u.title, u.primary_department,
    a.work_date, a.clock_in, a.clock_out FROM gm_attendance a JOIN gm_users u ON u.id = a.user_id
    ${where} ORDER BY a.clock_in`).bind(...values).all<Record<string, unknown>>();
  return rows.results.map((row) => ({
    id: Number(row.id), userId: String(row.user_id), name: String(row.name), initials: String(row.initials), title: String(row.title),
    department: (row.primary_department as Department | null) ?? null, workDate: String(row.work_date),
    clockIn: String(row.clock_in), clockOut: row.clock_out ? String(row.clock_out) : null,
  }));
}

export async function listAllAttendance(workDate = indiaDateKey()) {
  const leadership = { id: "system", role: "DM", departments: [] } as unknown as ERPUser;
  return listAttendanceFor(leadership, workDate);
}

export async function listRecentActivity(limit = 12) {
  await ensureErpDatabase();
  const db = await database();
  const rows = await db.prepare(`SELECT * FROM (
      SELECT 'task' AS type, tu.created_at AS occurred_at, u.name AS actor, tu.note AS detail,
        t.title AS subject, t.department AS department, tu.status AS state
      FROM gm_task_updates tu JOIN gm_users u ON u.id = tu.user_id JOIN gm_tasks t ON t.id = tu.task_id
      UNION ALL
      SELECT 'attendance' AS type, COALESCE(a.clock_out, a.clock_in) AS occurred_at, u.name AS actor,
        CASE WHEN a.clock_out IS NULL THEN 'Clocked in' ELSE 'Clocked out' END AS detail,
        u.title AS subject, u.primary_department AS department,
        CASE WHEN a.clock_out IS NULL THEN 'Working' ELSE 'Finished' END AS state
      FROM gm_attendance a JOIN gm_users u ON u.id = a.user_id
    ) ORDER BY occurred_at DESC LIMIT ?`).bind(limit).all<Record<string, unknown>>();
  return rows.results;
}

export async function createSession(userId: string) {
  await ensureErpDatabase();
  const db = await database();
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
  await db.prepare("DELETE FROM gm_sessions WHERE expires_at < ?").bind(new Date().toISOString()).run();
  await db.prepare("INSERT INTO gm_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").bind(tokenHash, userId, expiresAt).run();
  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  const db = await database();
  await db.prepare("DELETE FROM gm_sessions WHERE token_hash = ?").bind(await sha256(token)).run();
}

export async function userFromSession(token: string | null): Promise<ERPUser | null> {
  if (!token) return null;
  await ensureErpDatabase();
  const db = await database();
  const row = await db.prepare("SELECT user_id FROM gm_sessions WHERE token_hash = ? AND expires_at > ?")
    .bind(await sha256(token), new Date().toISOString()).first<{ user_id: string }>();
  return row ? getUserById(row.user_id) : null;
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = await derivePasswordHash(password, salt);
  if (actual.length !== expectedHash.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) difference |= actual.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  return difference === 0;
}

export async function changePassword(user: ERPUser, currentPassword: string, nextPassword: string) {
  if (nextPassword.length < 10) throw new Error("New password must have at least 10 characters");
  const db = await database();
  const row = await db.prepare("SELECT password_salt, password_hash FROM gm_users WHERE id = ?").bind(user.id)
    .first<{ password_salt: string; password_hash: string }>();
  if (!row || !(await verifyPassword(currentPassword, row.password_salt, row.password_hash))) throw new Error("Current password is incorrect");
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = Array.from(saltBytes, (value) => value.toString(16).padStart(2, "0")).join("");
  const hash = await derivePasswordHash(nextPassword, salt);
  await db.prepare("UPDATE gm_users SET password_salt = ?, password_hash = ? WHERE id = ?").bind(salt, hash, user.id).run();
}

async function derivePasswordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt: new TextEncoder().encode(salt),
    iterations: PASSWORD_HASH_ITERATIONS,
  }, key, 256);
  return Array.from(new Uint8Array(bits), (value) => value.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (part) => part.toString(16).padStart(2, "0")).join("");
}
