var input_text;
$(document).ready(function () {
    init();
})
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 13:
            send();
            break;
        default:
            break;
    }
});
function init() {
    input_text = document.getElementById("input_text");
    input_text.focus();
}
function send() {
    if (input_text.value == "" || input_text.value == null) {
        return;
    } else {
        var text = input_text.value;
        input_text.value = "";
        $('canvas').barrager([{"msg":text}]);
    }
    input_text.focus();
}