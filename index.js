var ctx = null;
var currMap = null;
var canvas = null;

var numberOfPlayers = 1;

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

class Player {
    position;
    movementModifier;
    constructor(position) {
        this.position = position;
        this.movementModifier = 1;
    }

    move(n) {
        if (this.position + n >= 0) {
            this.position += (n * this.movementModifier);
        }
    }
}

let arrMapa1 = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1];
const mapa1 = new Mapa(arrMapa1, 512, 512);

let arrMapa2 = [8, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2,
    0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2,
    1, 3, 2, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3,
    3, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1,
    2, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3,
    1, 2, 3, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2,
    0, 0, 1, 0, 2, 0, 0, 7, 1, 4, 2, 3, 1, 3, 2, 1,
    0, 0, 3, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0,
    2, 1, 2, 0, 2, 0, 0, 0, 2, 1, 2, 3, 1, 3, 2, 1,
    3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
    1, 0, 0, 0, 1, 3, 2, 1, 0, 3, 2, 1, 2, 3, 1, 3,
    3, 2, 1, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 7, 0, 0, 3, 2, 1, 0, 3, 2, 1, 2, 3, 1, 3,
    0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    9, 1, 3, 0, 0, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3];
const mapa2 = new Mapa(arrMapa2, 512, 512);

let arrMapa3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 9, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mapa3 = new Mapa(arrMapa3, 832, 576);

let arrMapa4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 9, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mapa4 = new Mapa(arrMapa4, 512, 224);


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//0 = casa void
//1 = casa vazia
//2 = positivo
//3 = negativo
//4 = santuario
//7 = cemiterio
//8 = inicio
//9 = fim

window.onload = function () {
    currMap = mapa3;
    canvas = document.getElementById("jogo");
    canvas.width = currMap.mWidth;
    canvas.height = currMap.mHeight;
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawGame);
}

function drawGame() {
    if (ctx == null) { return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var img = new Image();

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        console.log("image loaded: " + img.src);
    }

    for (var y = 0, i = 0; y < currMap.mHeight; y += tHeight) {
        for (var x = 0; x < currMap.mWidth; x += tWidth) {
            //console.log(currMap.array[i]);
            switch (currMap.array[i]) {
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
            i++;
        }
    }
    requestAnimationFrame(drawGame);
}

tileSetImage.onload = function () {
    drawGame();
}

tileSetImage.src = "img/tileset.png";

function toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = (toggle) ? "block" : "none";
    element.style.display = display;
}

function startGame() {
    toggleScreen("mainmenu", false);
    toggleScreen("jogo", true);
    numberOfPlayers = document.getElementById("players").value;
    console.log("numero de players:" + numberOfPlayers);
    drawGame();
}