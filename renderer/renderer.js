const {
    ipcRenderer
} = require('electron');

let newElem = function newElement(string) {
    let li = document.createElement('li');
    let t = document.createTextNode(string);
    li.appendChild(t);
    document.getElementById('myUL').appendChild(li);
    document.getElementById('myInput').value = '';

    let span = document.createElement('SPAN');
    let txt = document.createTextNode('\u00D7');
    span.className = 'close';
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            let div = this.parentElement;
            div.style.display = 'none';
        };
    }
};

ipcRenderer.on('getTodos', (event, day) => {
    document.getElementById('dateText').innerText = day.date;
    document.getElementById('myUL').innerHTML = '';

    day.todos.forEach(todo => {
        newElem(todo.name);
    });
});

let myNodelist = document.getElementsByTagName('LI');
let i;
for (i = 0; i < myNodelist.length; i++) {
    let span = document.createElement('SPAN');
    let txt = document.createTextNode('\u00D7');
    span.className = 'close';
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

let close = document.getElementsByClassName('close');
for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        let div = this.parentElement;
        div.style.display = 'none';
    };
}

let list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);

document.getElementById('myInput').onkeyup = function enterEvent(e) {
    if (e.keyCode === 13)
        document.getElementById('addBtn').click();
};

document.getElementById('addBtn').onclick = function newElemOnClick() {
    if (document.getElementById('myInput').value === '')
        alert('You must write something!');
    else {
        ipcRenderer.send('newTodo', {
            name: document.getElementById('myInput').value,
            note: '',
            isSuccess: 0
        });
        newElem(document.getElementById('myInput').value);
    }
};

//TODO: 전날 or 다음날로 갈 수 있게 하기

ipcRenderer.send('getTodos', new Date().toLocaleDateString());