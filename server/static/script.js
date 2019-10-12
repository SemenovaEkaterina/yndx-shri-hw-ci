document.addEventListener("DOMContentLoaded", function () {
    var hash = document.getElementById('hash');
    var command = document.getElementById('command');
    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/build', false);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({command: command.value, hash: hash.value}));
        xhr.onload = location.reload();
    })
});