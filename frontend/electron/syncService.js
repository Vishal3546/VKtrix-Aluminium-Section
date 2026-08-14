const { net } = require('electron');
const { getDB } = require('./database');

// NOTE: Replace this with your actual Spring Boot API URL
const SPRING_BOOT_API_URL = 'http://localhost:8080/api'; 

function startSyncService() {
  console.log('Sync service started');

  // We will run the sync check every 10 seconds
  setInterval(async () => {
    if (net.isOnline()) {
      await performSync();
    }
  }, 10000);
}

async function performSync() {
  const db = getDB();
  
  // Get pending items from sync_queue
  const pendingItems = db.prepare(`SELECT * FROM sync_queue ORDER BY created_at ASC`).all();
  
  if (pendingItems.length === 0) {
    return; // Nothing to sync
  }

  console.log(`Found ${pendingItems.length} items to sync.`);

  for (const item of pendingItems) {
    try {
      let endpoint = `${SPRING_BOOT_API_URL}/${item.entity_type}/sync`;
      
      const requestOptions = {
        method: 'POST', // Use POST for syncing, backend can handle based on item.action
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: item.action,
          payload: JSON.parse(item.payload)
        })
      };

      // We use standard fetch API since Node.js 18+ (Electron uses Node.js 18+)
      const response = await fetch(endpoint, requestOptions);

      if (response.ok) {
        console.log(`Successfully synced item ${item.id} of type ${item.entity_type}`);
        // Remove from queue after successful sync
        db.prepare(`DELETE FROM sync_queue WHERE id = ?`).run(item.id);
      } else {
        console.error(`Failed to sync item ${item.id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error syncing item ${item.id}:`, error.message);
      // Stop the loop and try again later if the network is down or server is unreachable
      break; 
    }
  }
}

module.exports = {
  startSyncService,
  SPRING_BOOT_API_URL // Exported to be overridden if needed
};
