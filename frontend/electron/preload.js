const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveToSyncQueue: (entityType, action, payload) => 
    ipcRenderer.invoke('save-to-sync-queue', { entityType, action, payload }),
  getLocalEntities: (entityType) => 
    ipcRenderer.invoke('get-local-entities', entityType),
});
