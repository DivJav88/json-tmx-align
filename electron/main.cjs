// electron/main.cjs
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
// Como tu dev está en 8080, lo dejamos así:
const DEV_URL = process.env.ELECTRON_START_URL || 'http://localhost:8080';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Carga el build (Vite genera /dist)
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

