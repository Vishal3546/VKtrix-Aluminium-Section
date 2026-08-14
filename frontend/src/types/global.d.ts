export interface ElectronAPI {
  saveToSyncQueue: (entityType: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: any) => Promise<{ success: boolean; id?: number; error?: string }>;
  getLocalEntities: (entityType: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
