const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;

function createWindow() {
    win = new BrowserWindow({width: 1200, height: 900});
    
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join('..', 'renderer', 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    win.webContents.openDevTools();

    win.on('close', () => {
        win = null;
    });
}

ipcMain.on('initial', (event, date) => {
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
        event.sender.send('getTodos');
    });
});

ipcMain.on('getPreviousTodo', (event, date) => {
    fs.readFile('./todos.json', (err, fileData) => {
        if(err)
            return console.log(err);
        let json = JSON.parse(fileData);
        for(let day in json)
            if(json[day].date === date && day != 0)
                return event.sender.send('getTodos', json[parseInt(day) - 1]);
    });
});

ipcMain.on('getNextTodo', (event, date) => {
    fs.readFile('./todos.json', (err, fileData) => {
        if(err)
            return console.log(err);
        let json = JSON.parse(fileData);
        for(let day in json)
        {
            if(json[day].date === date)
                return event.sender.send('getTodos', json[parseInt(day) + 1]);
        }
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