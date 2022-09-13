var ctx = null;
var tileW = 40, tileH = 40;
var mapW = 10, mapH = 10;

var gameMap = [8];

class Mapa {
    constructor(array, width, height){
        this.array = array; //quando for passar a array, adicionar explicitamente o inicio e o fim.
        this.width = width;
        this.height = height;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRand(spec) {
    var i, j, table = [];
    for (i in spec) {
        for (j = 0; j < spec[i] * 10; j++) {
            table.push(i);
        }
    }
    return function () {
        return table[Math.floor(Math.random() * table.length)];
    }
}

function generateMap() {
    for (var i = 1; i < (mapW * mapH) - 1; i++) {
        //0 = casa void
        //1 = casa vazia
        //2 = positivo
        //3 = negativo
        //8 = inicio
        //9 = fim
        var cl = weightedRand({ 1: 0.6, 2: 0.2, 3: 0.2 });
        var cl = cl();
        gameMap.push(parseInt(cl));
    }
    gameMap.push(9);

    console.log("generated map:");
    console.log(gameMap);
}

window.onload = function () {
    generateMap();
    ctx = document.getElementById("jogo").getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
}

function drawGame() {
    if (ctx == null) { return; }

    for (var y = 0; y < mapH; y++) {
        for (var x = 0; x < mapW; x++) {
            switch (gameMap[(y * mapW) + x]) {
                case 1:
                    ctx.fillStyle = "#a3a3a3";
                    break;
                case 2:
                    ctx.fillStyle = "#119928";
                    break;
                case 3:
                    ctx.fillStyle = "#b31919";
                    break;
                case 8:
                    ctx.fillStyle = "#140ddb";
                    break;
                case 9:
                    ctx.fillStyle = "#e6ed13";
                    break;
                default:
                    ctx.fillStyle = "#000000";
            }
            ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
        }
    }
    requestAnimationFrame(drawGame);
}