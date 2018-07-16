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
    win = new BrowserWindow({width: 1200, height: 900});

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

ipcMain.on('getTodos', (event, date) => {
    fs.readFile('./todos.json', (err, fileData) => {
        if(err)
            return console.log(err);
        let json = JSON.parse(fileData);
        for(let day in json) {
            if(json[day].date === date)
                return event.sender.send('getTodos', json[day]);
        }
        json.push({date: new Date().toLocaleDateString(), todos: []});
        fs.writeFile('./todos.json', JSON.stringify(json), (err) => {
            if(err)
                return console.log(err);
        });
    });
});

ipcMain.on('newTodo', (event, newTodo) => {
    console.log(newTodo);
    fs.readFile('./todos.json', (err, fileData) => {
        if(err)
            return console.log(err);
        let json = JSON.parse(fileData);
        json[json.length - 1].todos.push(newTodo);
        fs.writeFile('./todos.json', JSON.stringify(json), () => {
            if(err)
                return console.log(err);
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