import * as SQLite from 'expo-sqlite';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('scheduler.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type INTEGER NOT NULL,
      min_sets INTEGER NOT NULL,
      min_reps_or_time INTEGER NOT NULL,
      deleted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS weekly_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      target_sets INTEGER NOT NULL,
      target_reps_or_time INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS calendar_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      exercise_id INTEGER NOT NULL,
      target_sets INTEGER NOT NULL,
      target_reps_or_time INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workout_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      reps_done_or_actual_time INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
    );
  `);

  // Helper to ensure columns exist (for migrations)
  async function ensureColumn(table: string, column: string, type: string, defaultValue: string = '') {
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(${table})`);
    const hasColumn = tableInfo.some((col: any) => col.name === column);
    if (!hasColumn) {
      const def = defaultValue ? ` DEFAULT ${defaultValue}` : '';
      await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}${def}`);
    }
  }

  // Run migrations
  await ensureColumn('exercises', 'deleted', 'INTEGER', '0');
  await ensureColumn('weekly_schedule', 'day_of_week', 'INTEGER', '0');
  await ensureColumn('calendar_schedule', 'date', 'TEXT', "''");
  await ensureColumn('workout_logs', 'exercise_id', 'INTEGER', '0');

  const countResult = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises'
  );

  if ((countResult?.count ?? 0) === 0) {
    await db.execAsync(`
      INSERT INTO exercises (name, type, min_sets, min_reps_or_time) VALUES
        ('Push-ups', 1, 4, 30),
        ('Pull-ups', 1, 4, 5),
        ('Dips', 1, 4, 15),
        ('Squats', 1, 3, 50),
        ('Plank', 2, 3, 120);
    `);
  }

  return db;
}
