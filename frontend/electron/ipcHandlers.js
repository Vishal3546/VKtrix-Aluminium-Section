const { ipcMain } = require('electron');
const { getDB } = require('./database');

function registerIpcHandlers() {
  const db = getDB();

  // Save data to sync queue (used when offline or just to enqueue)
  ipcMain.handle('save-to-sync-queue', async (event, args) => {
    try {
      const { entityType, action, payload } = args;
      const stmt = db.prepare(`
        INSERT INTO sync_queue (entity_type, action, payload) 
        VALUES (?, ?, ?)
      `);
      const info = stmt.run(entityType, action, JSON.stringify(payload));
      
      // Also save to local entities cache for instant offline read
      if (action === 'INSERT' || action === 'UPDATE') {
        const id = payload.id || \`temp_\${Date.now()}\`; // Generate temp ID if none provided
        payload.id = id;
        
        const localStmt = db.prepare(`
          INSERT OR REPLACE INTO local_entities (id, entity_type, data)
          VALUES (?, ?, ?)
        `);
        localStmt.run(id, entityType, JSON.stringify(payload));
      } else if (action === 'DELETE') {
        const id = payload.id;
        const localStmt = db.prepare(`
          DELETE FROM local_entities WHERE id = ? AND entity_type = ?
        `);
        localStmt.run(id, entityType);
      }

      return { success: true, id: info.lastInsertRowid };
    } catch (error) {
      console.error('Error in save-to-sync-queue:', error);
      return { success: false, error: error.message };
    }
  });

  // Get local entities (for offline read)
  ipcMain.handle('get-local-entities', async (event, entityType) => {
    try {
      const stmt = db.prepare(`SELECT * FROM local_entities WHERE entity_type = ?`);
      const rows = stmt.all(entityType);
      return { success: true, data: rows.map(r => JSON.parse(r.data)) };
    } catch (error) {
      console.error('Error in get-local-entities:', error);
      return { success: false, error: error.message };
    }
  });

}

module.exports = {
  registerIpcHandlers
};
