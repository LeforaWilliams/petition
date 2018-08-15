var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
c.strokeStyle = "black";
var x;
var y;
var draw = false;
var canvasInput = document.getElementById("sig-input-field");
var drawData;

canvas.addEventListener("mousedown", function(e) {
    x = e.offsetX;
    y = e.offsetY;
    draw = true;
});

canvas.addEventListener("mousemove", function(e) {
    if (draw) {
        c.moveTo(x, y);
        x = e.offsetX;
        y = e.offsetY;
        console.log(x, y);
        c.lineTo(x, y);
        c.stroke();
    }
});

document.addEventListener("mouseup", function(e) {
    draw = false;
    drawData = canvas.toDataURL();
    canvasInput.value = drawData;
    //send canvas data to sig input field
    //I guess stop the stroke maybe
});
