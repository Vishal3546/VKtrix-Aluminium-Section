const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const electronServe = require('electron-serve');
const serve = electronServe.default || electronServe;
const { initDB } = require('./database');
const { startSyncService } = require('./syncService');
const { registerIpcHandlers } = require('./ipcHandlers');

const appServe = app.isPackaged ? serve({ directory: path.join(__dirname, '../out') }) : null;

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
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    appServe(mainWindow).then(() => {
      mainWindow.loadURL('app://-');
    });
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
    
    autoUpdater.on('update-available', () => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: 'A new version of the software is available. It is downloading in the background.',
        buttons: ['OK']
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'A new version has been downloaded. Restart the application to apply the updates.',
        buttons: ['Restart Now', 'Later']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });

    autoUpdater.on('error', (err) => {
      console.error('Error in auto-updater:', err);
    });
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
