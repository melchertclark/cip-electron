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