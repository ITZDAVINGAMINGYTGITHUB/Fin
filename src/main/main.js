const { app, BrowserWindow, ipcMain, dialog, session } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

// Import modules
const StorageService = require('../services/storage');
const ThemeManager = require('../services/theme');

// Keep a global reference of the window object
let mainWindow = null;
let windows = new Map(); // Track all windows by ID
let db = null;
let storage = null;

function initializeApp() {
  // Initialize database (must be called after app.whenReady())
  const dbPath = path.join(app.getPath('userData'), 'fin-data.db');
  db = new Database(dbPath);
  storage = new StorageService(db);
}

function createWindow(options = {}) {
  const isPrivate = options.isPrivate || false;
  
  const windowOptions = {
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0B1015',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
      partition: isPrivate ? `persist:private-${uuidv4()}` : 'persist:main',
      webviewTag: true,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 10, y: 10 },
  };

  const win = new BrowserWindow(windowOptions);
  
  const windowId = uuidv4();
  windows.set(windowId, {
    window: win,
    isPrivate,
    profile: options.profile || 'default',
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));

  win.on('closed', () => {
    windows.delete(windowId);
    if (BrowserWindow.getAllWindows().length === 0) {
      // Don't quit - keep app running
    }
  });

  return win;
}

function createMainWindow() {
  mainWindow = createWindow({ isPrivate: false, profile: 'default' });
}

// Handle app re-activation (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Prevent default app quit when last window closes (optional)
app.on('window-all-closed', () => {
  // Keep app running in background for quick relaunch
  // Or uncomment next line to quit:
  // app.quit();
});

// IPC Handlers
ipcMain.handle('get-windows', () => {
  const windowList = [];
  windows.forEach((data, id) => {
    windowList.push({
      id,
      isPrivate: data.isPrivate,
      profile: data.profile,
    });
  });
  return windowList;
});

ipcMain.handle('create-window', (event, options) => {
  const win = createWindow(options);
  return { success: true };
});

ipcMain.handle('close-window', (event, windowId) => {
  const winData = windows.get(windowId);
  if (winData) {
    winData.window.close();
  }
  return { success: true };
});

ipcMain.handle('get-profiles', () => {
  return storage.getProfiles();
});

ipcMain.handle('create-profile', (event, name) => {
  return storage.createProfile(name);
});

ipcMain.handle('delete-profile', (event, profileId) => {
  return storage.deleteProfile(profileId);
});

ipcMain.handle('switch-profile', (event, profileId) => {
  // This would restart the browser with the new profile
  return { success: true };
});

ipcMain.handle('get-settings', () => {
  return storage.getSettings();
});

ipcMain.handle('save-settings', (event, settings) => {
  return storage.saveSettings(settings);
});

ipcMain.handle('get-bookmarks', () => {
  return storage.getBookmarks();
});

ipcMain.handle('add-bookmark', (event, bookmark) => {
  return storage.addBookmark(bookmark);
});

ipcMain.handle('update-bookmark', (event, id, bookmark) => {
  return storage.updateBookmark(id, bookmark);
});

ipcMain.handle('delete-bookmark', (event, id) => {
  return storage.deleteBookmark(id);
});

ipcMain.handle('get-history', (event, limit = 100) => {
  return storage.getHistory(limit);
});

ipcMain.handle('add-history-item', (event, item) => {
  return storage.addHistoryItem(item);
});

ipcMain.handle('clear-history', () => {
  return storage.clearHistory();
});

ipcMain.handle('search-history', (event, query) => {
  return storage.searchHistory(query);
});

ipcMain.handle('get-downloads', () => {
  return storage.getDownloads();
});

ipcMain.handle('add-download', (event, download) => {
  return storage.addDownload(download);
});

ipcMain.handle('update-download', (event, id, update) => {
  return storage.updateDownload(id, update);
});

ipcMain.handle('remove-download', (event, id) => {
  return storage.removeDownload(id);
});

ipcMain.handle('get-themes', () => {
  return ThemeManager.getThemes();
});

ipcMain.handle('get-active-theme', () => {
  return ThemeManager.getActiveTheme();
});

ipcMain.handle('set-theme', (event, themeId) => {
  return ThemeManager.setTheme(themeId);
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

// Session handlers for downloads - must be set up after app is ready
function setupSessionHandlers() {
  session.defaultSession.on('will-download', (event, item, webContents) => {
    const downloadId = uuidv4();
    
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download interrupted');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download paused');
        } else {
          console.log(`Downloading: ${item.getReceivedBytes()} / ${item.getTotalBytes()}`);
        }
      }
      
      // Notify renderer
      webContents.send('download-progress', {
        downloadId,
        receivedBytes: item.getReceivedBytes(),
        totalBytes: item.getTotalBytes(),
        state: item.getState(),
      });
    });

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download completed');
      } else {
        console.log(`Download failed: ${state}`);
      }
      
      // Notify renderer
      webContents.send('download-done', {
        downloadId,
        state,
        filePath: item.getSavePath(),
      });
    });
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Initialize database and storage
  initializeApp();
  
  // Initialize database tables
  storage.initialize();
  
  // Set up session handlers for downloads
  setupSessionHandlers();
  
  createMainWindow();
});
