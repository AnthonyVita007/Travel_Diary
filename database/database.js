import * as SQLite from 'expo-sqlite';

let db;

export function getDb() {
  if (!db) {
    db = SQLite.openDatabase('TravelnelloDB.db');
  }
  return db;
}

// Funzione per inizializzare la tabella "trips"
export function initDbTables() {
  const db = getDb();
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS trips (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          imageUri TEXT,
          departureDate TEXT,
          returnDate TEXT,
          location TEXT,
          description TEXT,
          category TEXT,
          favorite INTEGER
        );`
    );
  });
}