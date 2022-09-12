var ctx = null;
var tileW = 40, tileH = 40;
var mapW = 10, mapH = 10;

var currentSecond = 0, frameCount = 0, framesLastSecond = 0;

var gameMap = [
    0, 0, 0, 0, 0, 0, 0
]

window.onload = function()
{
    ctx.document.getElementById("jogo").getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
}

function drawGame()
{
    if(ctx == null) {return;}
    
}