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

arrMapa1 = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1];
const mapa1 = new Mapa(arrMapa1, 512, 512, 32, 32);

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
    currMap = mapa1;
    canvas = document.getElementById("jogo");
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
    console.log(numberOfPlayers);
    drawGame();
}