/**
 * Utility functions to interact with the Electron IPC bridge from the Next.js frontend.
 * These functions will only work when the app is running inside Electron.
 */

export const isElectron = () => {
  return typeof window !== 'undefined' && window.electron !== undefined;
};

export const saveOfflineData = async (entityType: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) => {
  if (!isElectron()) {
    console.warn('Electron IPC is not available. Data is not saved offline.');
    return { success: false, error: 'Not running in Electron' };
  }
  return await window.electron.saveToSyncQueue(entityType, action, payload);
};

export const getOfflineData = async (entityType: string) => {
  if (!isElectron()) {
    console.warn('Electron IPC is not available. Cannot fetch offline data.');
    return { success: false, data: [] };
  }
  return await window.electron.getLocalEntities(entityType);
};
