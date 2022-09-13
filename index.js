var ctx = null;
var tileW = 40, tileH = 40;
var mapW = 10, mapH = 10;

var gameMap = [];

var negativeList = [["-1",true], ["-3",true], ["-10",true], ["/2",true], ["pav",true]];

var positiveList = [["+1",true], ["+3",true], ["+10",true], ["x2",true], ["jdn",true]];

class Mapa {
    array;
    width;
    height;
    constructor(array, width, height) {
        this.array = array; //quando for passar a array, adicionar explicitamente o inicio e o fim, e garantir o tamanho.
        this.width = width;
        this.height = height;
    }
}

arrMapa1 = [];
const mapa1 = new Mapa(arrMapa1, 10, 10);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*
function weightedRand(spec) {
    var i,
    j,
    table = [];
    for (i in spec) {
        for (j = 0; j < spec[i] * 10; j++) {
            table.push(i);
        }
    }
    return function () {
        return table[Math.floor(Math.random() * table.length)];
    }
}*/

function generateMap() {
    for (var i = 1; i < (mapW * mapH) - 1; i++) {
        //0 = casa void
        //1 = casa vazia
        //2 = positivo
        //3 = negativo
        //4 = santuario
        //7 = cemiterio
        //8 = inicio
        //9 = fim
        var cl = weightedRand({
            1: 0.6, 2: 0.2, 3: 0.2
        });
        var cl = cl();
        gameMap.push(parseInt(cl));
    }
    gameMap.push(9);

    console.log("generated map:");
    console.log(gameMap);
}

window.onload = function () {
    generateMap();
    ctx = document.getElementById("jogo").getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
}

function drawGame() {
    if (ctx == null) {
        return;
    }

    for (var y = 0; y < mapH; y++) {
        for (var x = 0; x < mapW; x++) {
            switch (gameMap[(y * mapW) + x]) {
                case 0:
                    var img = Image("img/void.png");
                    break;
                case 1:
                    var img = Image("img/vazia.png");
                    ctx.fillStyle = "#a3a3a3";
                    break;
                case 2:
                    var img = Image("img/positivo.png");
                    ctx.fillStyle = "#119928";
                    break;
                case 3:
                    var img = Image("img/negativo.png");
                    ctx.fillStyle = "#b31919";
                    break;
                case 4:
                    var img = Image("img/santuario.png");
                    break
                case 7:
                    var img = Image("img/cemiterio.png");
                    break;
                case 8:
                    var img = Image("img/inicio.png");
                    ctx.fillStyle = "#140ddb";
                    break;
                case 9:
                    var img = Image("img/fim.png");
                    ctx.fillStyle = "#e6ed13";
                    break;
                default:
                    ctx.fillStyle = "#000000";
                }
                ctx.drawImage(img, x*tileW, y*tileH, tileW, tileH);

                ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
            }
        }
        requestAnimationFrame(drawGame);
    }