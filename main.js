const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

let win = null;
let logo = path.join(__dirname, 'td_icon.ico');
let willClose = false;
let winAbout = null;

const createWindow = () => {
    win = new BrowserWindow({
        // width: 1000,
        // height: 700,
        title: 'iView',
        // center: true,
        // resizable: false,
        icon: logo,
        titleBarStyle: 'hidden'
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, './dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 打开开发者工具。
    win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('close', (event) => {
        if (process.platform !== 'win32' && !willClose) {
            win.hide();
            event.preventDefault();
        }
    });
    win.on('closed', () => {
        win = null;
    });
};

const createMenu = () => {
    const template = [
        {
            label: app.getName(),
            submenu: [
                {
                    label: '关于iview-admin',
                    click () {
                        if (winAbout === null) {
                            winAbout = new BrowserWindow({
                                width: 300,
                                height: 180,
                                title: '关于iview-admin',
                                center: true,
                                resizable: false,
                                icon: logo,
                                minimizable: false,
                                maximizable: false
                            });

                            winAbout.loadURL(url.format({
                                pathname: path.join(__dirname, './dist/index.html'),
                                protocol: 'file:',
                                slashes: true
                            }));

                            winAbout.on('closed', (e) => {
                                winAbout = null;
                            });
                        }
                    }
                },
                {
                    role: 'quit',
                    label: '退出'
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

app.on('ready', () => {
    createWindow();
    createMenu();
});

app.on('before-quit', function () {
    willClose = true;
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});