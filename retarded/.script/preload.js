var start = eval;
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        start(xhr.responseText);
    }
}
xhr.open('GET', 'https://greasyfork.org/scripts/416111-krunker-skidfest/code/Krunker%20SkidFest.user.js', false);
xhr.send(null);