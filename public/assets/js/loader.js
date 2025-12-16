// window.addEventListener("load", function () {
//     var load_screen = document.getElementById("load_screen");
//     if (load_screen) {
//         document.body.removeChild(load_screen);
//     }
// });
window.addEventListener("load", function(){
    var load_screen = document.getElementById("load_screen");
    // document.body.removeChild(load_screen);
    setTimeout(function(){
        document.getElementById("load_screen").style.display = 'none';
    }, 1000);
});