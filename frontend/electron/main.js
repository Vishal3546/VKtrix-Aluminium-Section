const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { initDB } = require('./database');
const { startSyncService } = require('./syncService');
const { registerIpcHandlers } = require('./ipcHandlers');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Next.js dev server URL or production static files
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : \`file://\${path.join(__dirname, '../out/index.html')}\`;

  mainWindow.loadURL(startUrl);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // 1. Initialize SQLite Database
  initDB();

  // 2. Register IPC handlers for frontend communication
  registerIpcHandlers();

  // 3. Start the background sync service to Spring Boot API
  startSyncService();

  // 4. Create the main window
  createWindow();

  // 5. Check for updates (only in production built app)
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
