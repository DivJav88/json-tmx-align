// electron/main.cjs
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
// Si en dev tu Vite corre en 8081, lánzalo así:
// ELECTRON_START_URL=http://localhost:8081 npm run start-electron
const DEV_URL = process.env.ELECTRON_START_URL || 'http://localhost:8080';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    // Descomenta si quieres abrir DevTools automáticamente
    // win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // IMPORTANT: usar resolve + ruta relativa correcta al build de Vite
    const indexPath = path.resolve(__dirname, '../dist/index.html');
    win.loadFile(indexPath);
  }

  // Abrir enlaces externos en el navegador
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
