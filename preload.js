const { contextBridge, ipcRenderer } = require('electron');

// Use contextBridge to expose the API to the renderer
contextBridge.exposeInMainWorld('api', {
  loadJsonFile: (filePath) => ipcRenderer.invoke('load-json-file', filePath),
  loadDefaultData: () => ipcRenderer.invoke('load-default-data'),
  saveSchemaConfig: (config) => ipcRenderer.invoke('save-schema-config', config),
  loadSchemaConfig: () => ipcRenderer.invoke('load-schema-config'),
  saveCustomUrls: (urls) => ipcRenderer.invoke('save-custom-urls', urls),
  loadCustomUrls: () => ipcRenderer.invoke('load-custom-urls'),
  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),
  saveData: (type, data) => ipcRenderer.invoke('save-data', type, data),
  saveToFile: (data) => ipcRenderer.invoke('save-file', data),
  
  // Unsaved changes communication
  markUnsavedChanges: () => ipcRenderer.send('mark-unsaved-changes'),
  markChangesSaved: () => ipcRenderer.send('mark-changes-saved'),
  
  // Save before close
  onSaveBeforeClose: (callback) => {
    ipcRenderer.on('save-before-close', () => callback());
    return () => ipcRenderer.removeListener('save-before-close', callback);
  },
  saveBeforeCloseComplete: (result) => ipcRenderer.send('save-before-close-complete', result),

  // Event listeners from main process
  onBeforeUnload: (callback) => {
    ipcRenderer.on('before-unload', () => callback());
    return () => ipcRenderer.removeListener('before-unload', callback);
  },
  onProgramDataSelected: (callback) => {
    ipcRenderer.on('program-data-selected', (_, path) => callback(path));
    // Return a function to remove the listener when no longer needed
    return () => ipcRenderer.removeListener('program-data-selected', callback);
  },
  onClubDataSelected: (callback) => {
    ipcRenderer.on('club-data-selected', (_, path) => callback(path));
    return () => ipcRenderer.removeListener('club-data-selected', callback);
  },
  onOpenSchemaConfig: (callback) => {
    ipcRenderer.on('open-schema-config', () => callback());
    return () => ipcRenderer.removeListener('open-schema-config', callback);
  }
});