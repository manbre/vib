const { BrowserWindow, app, ipcMain, Notification } = require("electron");
const path = require("path");

const { fork } = require("child_process");
fork(`${__dirname}/websocketServer.js`);

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    minWidth: 500,
    height: 900,
    minHeight: 750,
    icon: __dirname + "./src/assets/images/logo.png",
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.setOpacity(0.99);
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

ipcMain.on("notify", (_, message) => {
  new Notification({ title: "Notifiation", body: message }).show();
});

app.whenReady().then(createWindow);
