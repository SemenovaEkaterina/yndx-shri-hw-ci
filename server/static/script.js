document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById('input');
    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/build?command=' + input.value, false);
        xhr.send();
        xhr.onload = location.reload();
    })
});