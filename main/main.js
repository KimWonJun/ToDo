const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem
} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;
let menu = new Menu();

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});

    menu.append(new MenuItem({
        label: 'Open DevTool',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
            win.webContents.openDevTools();
        }
    }));
    
    win.setMenu(menu);

    win.loadURL(url.format({
        pathname: path.join('..', 'renderer', 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.on('close', () => {
        win = null;
    });
}

ipcMain.on('echo', (event, data) => {
    event.sender.send(data);
});

ipcMain.on('getTodos', (event) => {
    fs.readFile('./todos.json', (err, fileData) => {
        if(err)
        {
            console.log(err);
            return;
        }
        event.sender.send(JSON.parse(fileData));
    });
});

ipcMain.on('newTodo', (event, newTodo) => {
    fs.readFile('./todos.json', (err, fileData) => {
        let json = JSON.parse(fileData);
        if(err)
        {
            console.log(err);
            return;
        }
        json[json.length].todos.push(newTodo);
        fs.writeFile('./todos.json', JSON.stringify(json), () => {
            if(err)
            {
                console.log(err);
                return;
            }
        });
    });
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
});

app.on('activate', function () {
    if (win === null)
        createWindow();
});  