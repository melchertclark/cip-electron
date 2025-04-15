const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
// Import ElectronStore class
const ElectronStore = require('electron-store');

// Initialize configuration store
const store = new ElectronStore();

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Open DevTools in development mode
  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools();
  }

  // Prevent navigation in the app window
  mainWindow.webContents.on('will-navigate', (event) => {
    // Prevent all navigation events that would change the app's page
    event.preventDefault();
  });

  // Intercept new window creation attempts and handle them with openExternal
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open all URLs externally instead
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    // Prevent window creation
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Create menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Program Data',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [
                { name: 'JSON', extensions: ['json'] }
              ]
            });
            if (!canceled) {
              mainWindow.webContents.send('program-data-selected', filePaths[0]);
            }
          }
        },
        {
          label: 'Open Club Data',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [
                { name: 'JSON', extensions: ['json'] }
              ]
            });
            if (!canceled) {
              mainWindow.webContents.send('club-data-selected', filePaths[0]);
            }
          }
        },
        { 
          type: 'separator' 
        },
        {
          label: 'Configure Data Schema',
          click: () => {
            mainWindow.webContents.send('open-schema-config');
          }
        },
        { 
          type: 'separator' 
        },
        { 
          role: 'quit' 
        }
      ]
    },
    // Add Edit menu with copy/paste functionality
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://www.du.edu/');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for loading data
ipcMain.handle('load-json-file', async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading JSON file:', error);
    return null;
  }
});

// Handler for loading default data from downloads
ipcMain.handle('load-default-data', async () => {
  const programsPath = path.join(os.homedir(), 'Downloads', 'DUprograms.json');
  const clubsPath = path.join(os.homedir(), 'Downloads', 'categorized_clubs.json');
  const sampleProgramsPath = path.join(__dirname, 'data', 'sample-programs.json');
  const sampleClubsPath = path.join(__dirname, 'data', 'sample-clubs.json');
  
  const result = {
    programs: null,
    clubs: null,
    errors: []
  };

  // Try to load programs data
  try {
    const programsData = await fs.promises.readFile(programsPath, 'utf8');
    result.programs = JSON.parse(programsData);
  } catch (downloadError) {
    result.errors.push(`Could not load programs data from Downloads: ${downloadError.message}`);
    
    // Try to load sample data instead
    try {
      const sampleProgramsData = await fs.promises.readFile(sampleProgramsPath, 'utf8');
      result.programs = JSON.parse(sampleProgramsData);
      result.errors.push('Using sample programs data');
    } catch (sampleError) {
      result.errors.push(`Could not load sample programs data: ${sampleError.message}`);
    }
  }
  
  // Try to load clubs data
  try {
    const clubsData = await fs.promises.readFile(clubsPath, 'utf8');
    result.clubs = JSON.parse(clubsData);
  } catch (downloadError) {
    result.errors.push(`Could not load clubs data from Downloads: ${downloadError.message}`);
    
    // Try to load sample data instead
    try {
      const sampleClubsData = await fs.promises.readFile(sampleClubsPath, 'utf8');
      result.clubs = JSON.parse(sampleClubsData);
      result.errors.push('Using sample clubs data');
    } catch (sampleError) {
      result.errors.push(`Could not load sample clubs data: ${sampleError.message}`);
    }
  }
  
  return result;
});

// Handler for saving schema configuration
ipcMain.handle('save-schema-config', (event, config) => {
  store.set('schema', config);
  return true;
});

// Handler for opening external links in default browser
ipcMain.handle('open-external-link', (event, url) => {
  if (url) {
    try {
      // Ensure URL has a protocol
      const validUrl = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`;
      
      // Use shell.openExternal with options to ensure it doesn't affect current window
      shell.openExternal(validUrl, {
        activate: true,       // Activate the opened application
        workingDirectory: '/' // Default working directory
      });
      return true;
    } catch (error) {
      console.error('Failed to open external link:', error);
      return false;
    }
  }
  return false;
});

// Handler for loading schema configuration
ipcMain.handle('load-schema-config', () => {
  const defaultSchema = {
    programs: {
      name: 'name',
      description: 'description',
      link: 'link',
      extraLabel: 'degree',
      categoryField: 'eab_cip_code'
    },
    clubs: {
      name: 'name',
      description: 'description',
      link: 'website',
      extraLabel: '',
      categoryField: 'eab_cip_code'
    }
  };
  
  return store.get('schema', defaultSchema);
});

// Handler for saving custom URLs
ipcMain.handle('save-custom-urls', (event, urls) => {
  store.set('customUrls', urls);
  return true;
});

// Handler for loading custom URLs
ipcMain.handle('load-custom-urls', () => {
  const defaultUrls = {
    eduUrl: 'https://www.du.edu/',
    instaUrl: 'https://www.instagram.com/uofdenver/'
  };
  
  return store.get('customUrls', defaultUrls);
});