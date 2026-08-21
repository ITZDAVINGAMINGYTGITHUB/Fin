const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('finAPI', {
  // Window management
  getWindows: () => ipcRenderer.invoke('get-windows'),
  createWindow: (options) => ipcRenderer.invoke('create-window', options),
  closeWindow: (windowId) => ipcRenderer.invoke('close-window', windowId),
  
  // Profile management
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  createProfile: (name) => ipcRenderer.invoke('create-profile', name),
  deleteProfile: (profileId) => ipcRenderer.invoke('delete-profile', profileId),
  switchProfile: (profileId) => ipcRenderer.invoke('switch-profile', profileId),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  
  // Bookmarks
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  addBookmark: (bookmark) => ipcRenderer.invoke('add-bookmark', bookmark),
  updateBookmark: (id, bookmark) => ipcRenderer.invoke('update-bookmark', id, bookmark),
  deleteBookmark: (id) => ipcRenderer.invoke('delete-bookmark', id),
  
  // History
  getHistory: (limit) => ipcRenderer.invoke('get-history', limit),
  addHistoryItem: (item) => ipcRenderer.invoke('add-history-item', item),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  searchHistory: (query) => ipcRenderer.invoke('search-history', query),
  
  // Downloads
  getDownloads: () => ipcRenderer.invoke('get-downloads'),
  addDownload: (download) => ipcRenderer.invoke('add-download', download),
  updateDownload: (id, update) => ipcRenderer.invoke('update-download', id, update),
  removeDownload: (id) => ipcRenderer.invoke('remove-download', id),
  
  // Themes
  getThemes: () => ipcRenderer.invoke('get-themes'),
  getActiveTheme: () => ipcRenderer.invoke('get-active-theme'),
  setTheme: (themeId) => ipcRenderer.invoke('set-theme', themeId),
  
  // Dialogs
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  
  // Event listeners
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  onDownloadDone: (callback) => {
    ipcRenderer.on('download-done', (event, data) => callback(data));
  },
});

// Expose platform information
contextBridge.exposeInMainWorld('platform', {
  isMac: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux',
});
