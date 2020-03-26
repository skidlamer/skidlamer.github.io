if (window.jQuery) d();
else {
 var t = document.createElement("script");
 t.type = "text/javascript", t.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js", document.head.appendChild(t), t.onload = function() { d() }
}
function d() {
 $('.skype-microphone').click(function(){
 $('#icon').toggleClass('fa-microphone-slash');
 window.open('https://join.skype.com/IMoNXcO3sdf4')
});
}
