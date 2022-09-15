var ctx = null;
var currMap = null;
var canvas = null;

var ctxDado = null;
var canvasDado = null;

var numDado = 1;

var numberOfPlayers = 1;
var mapaSelecionado = 1;

var tileSetImage = new Image();
var tileSetDado = new Image();
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

let arrMapa1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mapa1 = new Mapa(arrMapa1, 576, 576);

let arrMapa2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 1, 3, 2, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 3, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 2, 0, 0, 0, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 1, 2, 3, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 0, 0, 1, 0, 2, 0, 0, 7, 1, 4, 2, 3, 1, 3, 2, 1, 0,
    0, 0, 0, 3, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 1, 2, 0, 2, 0, 0, 0, 2, 1, 2, 3, 1, 3, 2, 1, 0,
    0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 1, 0, 0, 0, 1, 3, 2, 1, 0, 3, 2, 1, 2, 3, 1, 3, 0,
    0, 3, 2, 1, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 7, 0, 0, 3, 2, 1, 0, 3, 2, 1, 2, 3, 1, 3, 0,
    0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 9, 1, 3, 0, 0, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mapa2 = new Mapa(arrMapa2, 576, 576);

let arrMapa3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 8, 0,
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
    0, 9, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0,
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
    canvas = document.getElementById("jogo");
    ctx = canvas.getContext("2d");

    canvasDado = document.getElementById("dado");
    ctxDado = canvasDado.getContext("2d");
}

function rodarDado() {
    numDado++;
    drawGame();
}

function drawDado(number) {
    if (ctxDado == null) { return; }

    ctxDado.clearRect(0, 0, canvasDado.width, canvasDado.height);

    switch (number) {
        case 1:
            ctxDado.drawImage(tileSetDado, 0, 0, 32, 32, 0, 0, 128, 128);
            break;
        case 2:
            ctxDado.drawImage(tileSetDado, 32, 0, 32, 32, 0, 0, 128, 128);
            break;
        case 3:
            ctxDado.drawImage(tileSetDado, 64, 0, 32, 32, 0, 0, 128, 128);
            break;
        case 4:
            ctxDado.drawImage(tileSetDado, 0, 32, 32, 32, 0, 0, 128, 128);
            break;
        case 5:
            ctxDado.drawImage(tileSetDado, 32, 32, 32, 32, 0, 0, 128, 128);
            break;
        case 6:
            ctxDado.drawImage(tileSetDado, 64, 32, 32, 32, 0, 0, 128, 128);
            break;
    }
}

function drawGame() {
    if (ctx == null) { return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDado(numDado);

    for (var y = 0, i = 0; y < currMap.mHeight; y += tHeight) {
        for (var x = 0; x < currMap.mWidth; x += tWidth) {
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

tileSetDado.onload = function () {
    drawGame();
}

tileSetDado.src = "img/dados_tileset.png";

function toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = (toggle) ? "block" : "none";
    element.style.display = display;
}

function startGame() {
    toggleScreen("mainmenu", false);
    toggleScreen("jogo", true);
    toggleScreen("voltar", true);
    toggleScreen("dado", true);
    numberOfPlayers = document.getElementById("players").value;
    mapaSelecionado = parseInt(document.querySelector('input[name="mapselect"]:checked').value);
    console.log("numero de players: " + numberOfPlayers);
    console.log("mapa selecionado: " + mapaSelecionado);
    switch (mapaSelecionado) {
        case 1:
            currMap = mapa1;
            break;
        case 2:
            currMap = mapa2;
            break;
        case 3:
            currMap = mapa3;
            break;
        case 4:
            currMap = mapa4;
            break;
    }
    canvas.width = currMap.mWidth;
    canvas.height = currMap.mHeight;
    drawGame();
}

function voltar() {
    toggleScreen("mainmenu", true);
    toggleScreen("jogo", false);
    toggleScreen("voltar", false);
    toggleScreen("dado", false);
}