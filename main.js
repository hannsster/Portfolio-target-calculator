const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1250,
        height: 900,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        title: "Portfolio Target Calculator",
        autoHideMenuBar: true
    });

    win.loadFile('index.html');
}

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (result.canceled) return null;

    const folderPath = result.filePaths[0];
    const files = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .map(file => path.join(folderPath, file));

    return { folderPath, files };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});