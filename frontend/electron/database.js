const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db;

function initDB() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'appData.db');
  
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  
  console.log(`Initialized SQLite database at: ${dbPath}`);

  // Create tables if they don't exist
  // We are creating a generic sync_queue table for offline data sync
  // and a generic entities table for offline access.
  db.exec(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
      payload TEXT NOT NULL, -- JSON string of the data
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS local_entities (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      data TEXT NOT NULL, -- JSON string
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

module.exports = {
  initDB,
  getDB
};
