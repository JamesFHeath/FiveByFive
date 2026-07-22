import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import sqliteWasmUrl from './sqlite3.wasm';

let dbInstance = null;
let sqlite3 = null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS workout_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    type_id INTEGER,
    sets INTEGER,
    reps INTEGER,
    weight INTEGER,
    FOREIGN KEY (type_id) REFERENCES workout_types(id)
  );
`;

const SEED_TYPES = `
  INSERT INTO workout_types (name)
  SELECT * FROM (
    SELECT 'Bench Press' UNION ALL
    SELECT 'Squats' UNION ALL
    SELECT 'Deadlifts' UNION ALL
    SELECT 'Military Press' UNION ALL
    SELECT 'Lat Rows'
  )
  WHERE NOT EXISTS (SELECT 1 FROM workout_types);
`;

export async function initDB() {
  if (dbInstance) return dbInstance;

  sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
    locateFile: () => sqliteWasmUrl,
  });

  dbInstance = new sqlite3.oo1.DB();
  dbInstance.exec(SCHEMA);
  dbInstance.exec(SEED_TYPES);
  return dbInstance;
}

export function downloadDatabase(filename = "tracker.sqlite3") {
  if (!dbInstance) return;
  const bytes = sqlite3.capi.sqlite3_js_db_export(dbInstance.pointer);
  const blob = new Blob([bytes], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function loadDatabaseFromFile(file) {
  if (!sqlite3) throw new Error("SQLite not initialized. Call initDB first.");

  const buf = new Uint8Array(await file.arrayBuffer());

  if (dbInstance) dbInstance.close();

  const p = sqlite3.wasm.allocFromTypedArray(buf);
  dbInstance = new sqlite3.oo1.DB();
  const rc = sqlite3.capi.sqlite3_deserialize(
    dbInstance.pointer, 'main', p, buf.byteLength, buf.byteLength,
    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
  );
  dbInstance.checkRc(rc);

  dbInstance.exec(SCHEMA);
  return dbInstance;
}

export function getDB() {
  return dbInstance;
}