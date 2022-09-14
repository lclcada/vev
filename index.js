var ctx = null;
var currMap = null;
var gameMap = [];
var tileSetImage = new Image();
const tWidth = 32;
const tHeight = tWidth;

var negativeList = [["-1", true], ["-3", true], ["-10", true], ["/2", true], ["pav", true]];

var positiveList = [["+1", true], ["+3", true], ["+10", true], ["x2", true], ["jdn", true]];

class Mapa {
    array;
    mWidth;
    mHeight;
    constructor(array, mWidth, mHeight) {
        this.array = array; //quando for passar a array, adicionar explicitamente o inicio e o fim, e garantir o tamanho.
        this.mWidth = mWidth;
        this.mHeight = mHeight;
    }
}

arrMapa1 = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1];
const mapa1 = new Mapa(arrMapa1, 512, 512, 32, 32);

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

//0 = casa void
//1 = casa vazia
//2 = positivo
//3 = negativo
//4 = santuario
//7 = cemiterio
//8 = inicio
//9 = fim

/*
function generateMap() {
    for (var i = 1; i < (mapW * mapH) - 1; i++) {
        var cl = weightedRand({
            1: 0.6, 2: 0.2, 3: 0.2
        });
        var cl = cl();
        gameMap.push(parseInt(cl));
    }
    gameMap.push(9);

    console.log("generated map:");
    console.log(gameMap);
}*/

window.onload = function () {
    currMap = mapa1;
    canvas = document.getElementById("jogo");
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (ctx == null) { return; }

    var img = new Image();

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        console.log("image loaded: " + img.src);
    }

    var mapW = currMap.mWidth;
    var mapH = currMap.mHeight;

    for (var y = 0, i = 0; y < mapH; y += tHeight, i++) {
        console.log("h = " + mapH + " y = " + y);
        for (var x = 0, j = 0; x < mapW; x += tWidth, j++) {
            console.log("w = " + mapW + " x = " + x);
            console.log(currMap.array[i + j]);
            switch (currMap.array[i + j]) {
                case 0:
                    ctx.drawImage(tileSetImage, 0, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 1:
                    ctx.drawImage(tileSetImage, 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 2:
                    ctx.drawImage(tileSetImage, 64, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 3:
                    ctx.drawImage(tileSetImage, 96, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 4:
                    ctx.drawImage(tileSetImage, 128, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 7:
                    ctx.drawImage(tileSetImage, 160, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 8:
                    ctx.drawImage(tileSetImage, 192, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 9:
                    ctx.drawImage(tileSetImage, 224, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                default:
                    ctx.drawImage(tileSetImage, 256, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
            }

            //ctx.fillRect(x * tileW, y * tileH, tileW, tileH);
        }
    }
    //requestAnimationFrame(drawGame);
}

tileSetImage.onload = function () {
    
}

tileSetImage.src = "img/tileset.png";