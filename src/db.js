import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import sqliteWasmUrl from './sqlite3.wasm';

let dbInstance = null;

async function getDbBytesFromIDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open("WeightTrackerDB", 1);
    request.onupgradeneeded = (e) => e.target.result.createObjectStore("files");
    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("files", "readonly");
      const store = tx.objectStore("files");
      const getReq = store.get("tracker.sqlite3");
      getReq.onsuccess = () => resolve(getReq.result || null);
    };
  });
}

async function saveDbBytesToIDB(byteArray) {
  return new Promise((resolve) => {
    const request = indexedDB.open("WeightTrackerDB", 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");
      store.put(byteArray, "tracker.sqlite3");
      tx.oncomplete = () => resolve();
    };
  });
}

export async function initDB() {
  if (dbInstance) return dbInstance;

  try {
    const sqlite3 = await sqlite3InitModule({
      print: console.log,
      printErr: console.error,
      locateFile: () => sqliteWasmUrl
    });

    const savedBytes = await getDbBytesFromIDB();

    if (savedBytes) {
      const p = sqlite3.wasm.allocFromTypedArray(savedBytes);
      dbInstance = new sqlite3.oo1.DB();
      const rc = sqlite3.capi.sqlite3_deserialize(
        dbInstance.pointer, 'main', p, savedBytes.byteLength, savedBytes.byteLength, 
        sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
      );
      dbInstance.checkRc(rc);
      console.log('Existing database loaded from IndexedDB.');
    } else {
      dbInstance = new sqlite3.oo1.DB();
      dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT,
          exercise TEXT,
          weight REAL,
          reps INTEGER
        );
      `);
      console.log('New database created.');
    }
    
    return dbInstance;
  } catch (err) {
    console.error('Failed to initialize SQLite:', err);
    throw err;
  }
}

// --- Save Function ---
// Call this function in your React app after any INSERT, UPDATE, or DELETE
export async function saveDatabase() {
  if (!dbInstance) return;
  const byteArray = dbInstance.export(); 
  await saveDbBytesToIDB(byteArray);
  console.log('Database state saved locally.');
}