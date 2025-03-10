const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Required for `ipcRenderer` to work
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools (optional).
  // mainWindow.webContents.openDevTools();

  // Listen for logs from the renderer process
  ipcMain.on('log', (event, message) => {
    console.log(`[Renderer] ${message}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  app.quit();
});