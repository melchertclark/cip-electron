const { contextBridge, ipcRenderer } = require('electron');

// Use contextBridge to expose the API to the renderer
contextBridge.exposeInMainWorld('api', {
    loadFile: () => ipcRenderer.invoke('load-file'),
    saveToFile: (data) => ipcRenderer.invoke('save-file', data),
    onSaveComplete: (callback) => {
        ipcRenderer.on('save-complete', (_, result) => callback(result));
        return () => ipcRenderer.removeListener('save-complete', callback);
    },
    onFileLoaded: (callback) => ipcRenderer.on('file-loaded', callback),
    onError: (callback) => {
        ipcRenderer.on('error', (_, error) => callback(error));
        return () => ipcRenderer.removeListener('error', callback);
    },
    markChangesSaved: () => ipcRenderer.send('mark-changes-saved')
}); 