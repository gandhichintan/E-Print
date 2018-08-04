const electron = require('electron');
const ps = require('ps-man');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const crashReporter = electron.crashReporter;

const path = require('path');
const url = require('url');

let mainWindow, appTray;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1024/*324*/, height: 640 });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function createTray() {
    appTray = new Tray(path.join(__dirname, '../assets/icons/32x32.png'));

    let trayMenu = Menu.buildFromTemplate([
        { label: "About", role: "about" }
    ]);

    appTray.setContextMenu(trayMenu);

    setInterval(() => {
        let psOptions = {
            name: 'printservice'
        };

        ps.list(psOptions, (err, result) => {
            if (err)
                throw new Error(err);

            if (result.length > 0) {
                appTray.setImage(path.join(__dirname, '../assets/icons/32x32_running.png'))
            }
            else {
                appTray.setImage(path.join(__dirname, '../assets/icons/32x32_stop.png'))
            }
        });
    }, 1000);

}

function setupCrashReporter() {
    crashReporter.start({
        productName: 'ePrinter',
        companyName: 'ePrinter',
        submitURL: 'https://eprintercrash.localtunnel.me',
        uploadToServer: true
    });
}

app.on('ready', () => {
    setupCrashReporter();
    createWindow();
    createTray();
});

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // not sure if that's the case for ePrinter
    //  if (process.platform !== 'darwin') {
    app.quit();
    //  }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

process.on('uncaughtException', (err) => {
    console.log('application almost crashed!', err);
    app.exit(1);
});
