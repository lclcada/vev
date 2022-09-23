var ctx = null, canvas = null, ctxDado = null, canvasDado = null;
var currMap = null, maxPlayers = 5;

const l = "l", r = "r", u = "u", d = "d", e = "end";
const tWidth = 32, tHeight = tWidth;

var numDado = 0;
var activePlayers = [];
var currentPlayerIndex = 0;
var mapaSelecionado = 1;

var tileSetImage = new Image();
var tileSetDado = new Image();

var positiveList = [[0, true], [1, true], [2, true], [3, true], [4, true]];
var negativeList = [[0, true], [1, true], [2, true], [3, true], [4, true]];
//0 = +-1 //1 = +-3 //2 = +-10 //3 = x/2 //4 = jdn/pav

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedRand(spec) {
    let i, j, table = [];
    for (i in spec) {
        for (j = 0; j < spec[i] * 10; j++) {
            table.push(i);
        }
    }
    return function () {
        return table[Math.floor(Math.random() * table.length)];
    }
}

class Mapa {
    array;
    mapArray;
    mWidth;
    mHeight;

    constructor(array, mWidth, mHeight, direct) {
        this.array = array;
        this.mWidth = mWidth;
        this.mHeight = mHeight;

        var mapArray = [];
        for (let i = 0; i < array.length; i++) {
            let tp = null, mod = null, dir = null;
            let enabledArray = [], disabledArray = [];
            tp = array[i];
            let directCount = 0;

            if (array[i] != 0) {
                dir = direct[directCount];
                directCount++;
            }

            if (array[i] == 2) {
                let posEnabled = 0;
                for (let j = 0; j < positiveList.length; j++) {
                    if (positiveList[j][1] == true) {
                        enabledArray[posEnabled] = positiveList[j][0];
                        posEnabled++;
                    }
                }
                if (posEnabled == 0) { console.log("¯\_(ツ)_/¯"); break; }
                let rnd = weightedRand({ 0: 0.3, 1: 0.25, 2: 0.1, 3: 0.15, 4: 0.2 });
                rnd = rnd();
                mod = enabledArray[getRandomInt(0, posEnabled - 1)];
            }
            else if (array[i] == 3) {
                let posDisabled = 0;
                for (let j = 0; j < negativeList.length; j++) {
                    if (negativeList[j][1] == true) {
                        disabledArray[posDisabled] = negativeList[j][0];
                        posDisabled++;
                    }
                }
                if (posDisabled == 0) { console.log("¯\_(ツ)_/¯"); break; }
                let rnd = weightedRand({ 0: 0.3, 1: 0.25, 2: 0.1, 3: 0.15, 4: 0.2 });
                rnd = rnd();
                mod = disabledArray[getRandomInt(0, posDisabled - 1)];
            }

            let c = new Casa(tp, mod, dir);
            mapArray.push(c);
        }

        this.mapArray = mapArray;
    }
}

class Casa {
    tipo;
    modificador;
    direcao;
    constructor(tipo, modificador, direcao) {
        this.tipo = tipo;
        this.modificador = modificador;
        this.direcao = direcao;
    }
}

class Player {
    position;
    movementModifier;
    tipo;
    nome;
    constructor(tipo, nome) {
        this.tipo = parseInt(tipo);
        this.nome = nome;
        this.position = currMap.array.indexOf(8);
        console.log(this.position);
    }

    initializePosition(position) {
        this.position = position;
        this.movementModifier = 1;
    }

    move(n) {
        if (this.position + n >= 0) {
            this.position += (n * this.movementModifier);
        }
    }
}

var mapas = [];

let dirMapa1 = [d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, d, d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, d, d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, d, d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, e];
let arrMapa1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrMapa1, 18 * 32, 18 * 32, dirMapa1));

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
mapas.push(new Mapa(arrMapa2, 18 * 32, 18 * 32, dirMapa1));

let arrMapa3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 9, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 0, 7, 0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrMapa3, 26 * 32, 18 * 32, dirMapa1));

let arrMapa4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 9, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrMapa4, 16 * 32, 7 * 32, dirMapa1));

let arrmapa5 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 8, 0,
    0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 2, 1, 2, 3, 0, 1, 3, 2, 1, 0, 0, 2, 3, 1, 0, 1, 3, 2, 1, 2, 3, 1, 0, 3, 1, 3, 2, 1, 2, 0,
    0, 1, 0, 0, 0, 1, 0, 2, 0, 0, 5, 0, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, 0, 5, 0, 2, 0, 0, 0, 0, 3, 0,
    0, 3, 0, 10, 0, 3, 0, 3, 0, 3, 1, 3, 0, 2, 0, 2, 4, 2, 0, 0, 0, 2, 3, 1, 0, 1, 2, 3, 1, 0, 1, 0,
    0, 2, 0, 10, 0, 2, 0, 1, 0, 2, 0, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 4, 0, 7, 0,
    0, 1, 0, 10, 0, 1, 0, 3, 0, 1, 0, 1, 0, 7, 0, 0, 0, 1, 3, 2, 0, 2, 0, 1, 3, 2, 1, 2, 3, 0, 1, 0,
    0, 2, 0, 10, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 2, 1, 0, 3, 0, 1, 0, 3, 0, 3, 0, 0, 0, 0, 2, 0, 3, 0,
    0, 3, 0, 10, 0, 3, 0, 1, 0, 3, 0, 3, 0, 0, 0, 2, 0, 2, 0, 3, 0, 1, 0, 2, 0, 10, 10, 0, 1, 0, 2, 0,
    0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 0, 1, 0, 3, 1, 3, 0, 1, 0, 2, 0, 3, 0, 1, 0, 10, 10, 0, 2, 0, 1, 0,
    0, 3, 2, 1, 2, 3, 0, 3, 0, 3, 0, 3, 0, 2, 0, 0, 0, 2, 0, 1, 0, 2, 0, 2, 0, 10, 10, 0, 3, 0, 2, 0,
    0, 0, 0, 2, 0, 0, 0, 1, 0, 2, 1, 2, 0, 1, 2, 3, 1, 3, 0, 2, 0, 1, 0, 3, 0, 10, 10, 0, 1, 0, 3, 0,
    0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 0, 1, 0, 0, 0, 0, 3, 0, 1, 0,
    0, 0, 0, 4, 3, 2, 1, 2, 0, 0, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 0, 3, 1, 5, 1, 3, 2, 1, 2, 0, 9, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa5, 32 * 32, 16 * 32, dirMapa1));

let arrmapa6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 4, 2, 0, 2, 4, 2, 0, 2, 4, 2, 0, 2, 4, 2, 0, 2, 4, 2, 0, 2, 9, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
    0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0,
    0, 8, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa6, 24 * 32, 17 * 32, dirMapa1));

let arrmapa7 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 2, 1, 2, 3, 1, 0, 0, 1, 3, 2, 1, 2, 0, 0,
    0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0,
    0, 0, 1, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 1, 0, 0,
    0, 0, 3, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 3, 0, 0,
    0, 0, 2, 1, 8, 0, 2, 0, 0, 2, 0, 9, 1, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 0,
    0, 3, 1, 3, 2, 1, 2, 0, 0, 2, 1, 2, 3, 1, 3, 0,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0,
    0, 0, 3, 1, 3, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0,
    0, 0, 0, 0, 2, 1, 5, 1, 1, 5, 1, 2, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa7, 16 * 32, 16 * 32, dirMapa1));

let arrmapa8 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 4, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 7, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 4, 0, 1, 0,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0,
    0, 1, 0, 5, 1, 2, 3, 1, 3, 2, 5, 0, 3, 0, 2, 0,
    0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 3, 0,
    0, 3, 0, 2, 0, 7, 2, 3, 1, 0, 3, 0, 3, 0, 1, 0,
    0, 1, 0, 3, 0, 2, 0, 0, 9, 0, 1, 0, 2, 0, 3, 0,
    0, 3, 0, 1, 0, 3, 0, 0, 0, 0, 3, 0, 1, 0, 2, 0,
    0, 2, 0, 3, 0, 4, 3, 2, 1, 2, 7, 0, 2, 0, 1, 0,
    0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 0,
    0, 2, 0, 5, 2, 3, 1, 3, 2, 1, 2, 3, 5, 0, 3, 0,
    0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 4, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 7, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa8, 16 * 32, 16 * 32, dirMapa1));

let arrmapa9 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 7, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 5, 0,
    0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 0, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0,
    0, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 0, 2, 0,
    0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0,
    0, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 0, 1, 0,
    0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 2, 3, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa8, 16 * 32, 16 * 32, dirMapa1));

let arrmapa10 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0,
    0, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0,
    0, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0,
    0, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 5, 5, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa10, 16 * 32, 16 * 32, dirMapa1));

let arrmapa11 = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 3, 1, 2, 3, 0, 0, 0,
    2, 3, 1, 2, 0, 0, 1, 2, 3, 0,
    0, 0, 0, 3, 1, 2, 3, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 1, 3, 2, 1, 3, 2, 1, 3, 0,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 1, 2, 3, 1, 2, 3, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    9, 1, 3, 2, 1, 3, 2, 1, 3, 0];
mapas.push(new Mapa(arrmapa11, 10 * 32, 10 * 32, dirMapa1));

let arrmapa12 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
    0, 7, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0,
    0, 7, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
    0, 7, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0,
    0, 12, 1, 3, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 1, 2, 3, 2, 1, 0,
    0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa12, 20 * 32, 18 * 32, dirMapa1));

let arrmapa13 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2, 1, 2, 3, 1, 3, 0, 0, 0, 0, 2, 1, 2, 0, 0,
    0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 3, 1, 3, 0, 3, 0, 0,
    0, 2, 3, 7, 3, 2, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 3, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 2, 0,
    0, 2, 0, 10, 0, 2, 0, 1, 3, 0, 0, 2, 0, 0, 0, 0, 1, 0,
    0, 3, 0, 10, 0, 3, 0, 3, 0, 0, 0, 3, 1, 0, 0, 0, 2, 0,
    0, 1, 0, 10, 0, 1, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0,
    0, 3, 0, 10, 0, 3, 0, 1, 0, 0, 0, 0, 2, 0, 0, 3, 1, 0,
    0, 2, 0, 10, 0, 2, 0, 2, 3, 1, 3, 2, 1, 0, 0, 2, 0, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    0, 2, 3, 1, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0,
    0, 0, 0, 3, 0, 0, 0, 3, 2, 1, 2, 3, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 2, 0, 2, 3, 4, 10, 10, 10, 1, 3, 2, 1, 2, 3, 0,
    0, 0, 0, 1, 0, 1, 0, 3, 2, 1, 2, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 3, 0, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 1, 9, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa13, 18 * 32, 18 * 32, dirMapa1));

let arrmapa14 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0,
    0, 1, 0, 1, 3, 2, 0, 0, 0, 0, 0, 0, 2, 3, 1, 0, 1, 0,
    0, 3, 0, 3, 0, 1, 0, 3, 6, 6, 3, 0, 1, 0, 3, 0, 3, 0,
    0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0,
    0, 1, 0, 1, 0, 3, 0, 1, 0, 0, 1, 0, 3, 0, 1, 0, 1, 0,
    0, 4, 0, 2, 0, 1, 0, 2, 0, 0, 2, 0, 1, 0, 2, 0, 4, 0,
    0, 1, 0, 3, 0, 3, 0, 3, 0, 0, 3, 0, 3, 0, 3, 0, 1, 0,
    0, 2, 0, 1, 0, 2, 0, 1, 0, 0, 1, 0, 2, 0, 1, 0, 2, 0,
    0, 3, 0, 3, 0, 1, 0, 3, 0, 0, 3, 0, 1, 0, 3, 0, 3, 0,
    0, 1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 1, 0,
    0, 12, 0, 1, 0, 3, 0, 1, 0, 0, 1, 0, 3, 0, 1, 0, 12, 0,
    0, 1, 0, 2, 0, 1, 0, 2, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0,
    0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0,
    0, 2, 0, 1, 0, 2, 0, 1, 0, 0, 1, 0, 2, 0, 1, 0, 2, 0,
    0, 1, 0, 3, 0, 1, 2, 3, 0, 0, 3, 2, 1, 0, 3, 0, 1, 0,
    0, 7, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 7, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa14, 18 * 32, 18 * 32, dirMapa1));

let arrmapa15 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
    10, 11, 1, 2, 3, 1, 10, 10, 10, 10, 1, 3, 2, 1, 9, 10,
    0, 4, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0,
    0, 11, 1, 2, 3, 1, 10, 10, 10, 10, 1, 3, 2, 1, 5, 0,
    0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 4, 0,
    0, 11, 1, 2, 3, 1, 10, 10, 10, 10, 1, 3, 2, 1, 5, 0,
    0, 4, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0,
    0, 11, 1, 2, 3, 1, 10, 10, 10, 10, 1, 3, 2, 1, 5, 0,
    0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 4, 0,
    0, 11, 1, 2, 3, 1, 10, 10, 10, 10, 1, 3, 2, 1, 5, 0,
    0, 4, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0,
    0, 11, 1, 2, 3, 1, 10, 10, 10, 10, 1, 3, 2, 1, 5, 0,
    0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 4, 0,
    0, 8, 1, 3, 2, 1, 10, 10, 10, 10, 1, 2, 3, 1, 5, 0,
    0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa15, 16 * 32, 16 * 32, dirMapa1));

let arrmapa16 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 3, 1, 3, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 3, 2, 1, 2, 0, 0, 1, 2, 3, 1, 0, 0, 0,
    0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0,
    0, 0, 2, 0, 0, 1, 2, 3, 1, 3, 2, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 3, 2, 0, 0, 0, 0, 1, 2, 0, 2, 0, 0,
    0, 3, 2, 0, 1, 0, 0, 10, 10, 0, 0, 3, 0, 3, 1, 0,
    0, 1, 0, 0, 3, 0, 10, 10, 10, 10, 0, 1, 0, 0, 3, 0,
    0, 3, 0, 0, 2, 0, 10, 10, 10, 10, 0, 3, 0, 0, 2, 0,
    0, 2, 1, 0, 1, 0, 0, 10, 10, 0, 0, 2, 0, 2, 1, 0,
    0, 0, 2, 0, 2, 3, 0, 0, 0, 0, 2, 1, 0, 3, 0, 0,
    0, 0, 3, 0, 0, 1, 12, 9, 0, 1, 3, 0, 0, 1, 0, 0,
    0, 0, 1, 3, 0, 0, 0, 0, 0, 3, 0, 0, 2, 3, 0, 0,
    0, 0, 0, 2, 1, 2, 3, 0, 0, 2, 0, 8, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 1, 3, 2, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa16, 16 * 32, 16 * 32, dirMapa1));

let arrmapa17 = [0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 1, 2, 0, 2, 1, 11, 10, 10, 11, 1, 2, 0, 2, 1, 9, 0,
    0, 0, 0, 3, 0, 3, 10, 10, 10, 10, 10, 10, 3, 0, 3, 0, 0, 0,
    0, 2, 3, 1, 0, 1, 3, 2, 10, 10, 2, 3, 1, 0, 1, 3, 2, 0,
    0, 1, 0, 0, 0, 0, 0, 1, 10, 10, 1, 0, 0, 0, 0, 0, 1, 0,
    0, 2, 3, 1, 0, 1, 3, 2, 10, 10, 2, 3, 1, 0, 1, 3, 2, 0,
    0, 0, 0, 3, 0, 3, 10, 10, 10, 10, 10, 10, 3, 0, 3, 0, 0, 0,
    0, 2, 1, 2, 0, 2, 1, 5, 10, 10, 5, 1, 2, 0, 2, 1, 2, 0,
    0, 3, 0, 0, 0, 0, 0, 6, 10, 10, 6, 0, 0, 0, 0, 0, 3, 0,
    0, 1, 3, 2, 0, 2, 3, 5, 10, 10, 5, 3, 2, 0, 2, 3, 1, 0,
    0, 0, 0, 1, 0, 3, 10, 10, 10, 10, 10, 10, 3, 0, 1, 0, 0, 0,
    0, 1, 3, 2, 0, 2, 3, 5, 10, 10, 5, 3, 2, 0, 2, 3, 1, 0,
    0, 3, 0, 0, 0, 0, 0, 1, 10, 10, 1, 0, 0, 0, 0, 0, 3, 0,
    0, 2, 1, 2, 3, 1, 3, 2, 10, 10, 2, 3, 1, 3, 2, 1, 2, 0,
    0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0,
    10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
mapas.push(new Mapa(arrmapa17, 18 * 32, 16 * 32, dirMapa1));

let arrmapa18 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 0, 2, 3, 1, 3, 2, 4, 0, 1, 3, 2, 1, 2, 3, 1, 0, 3, 2, 1, 2, 3, 1, 0, 3, 2, 1, 0, 0, 9, 0,
    0, 1, 0, 1, 10, 10, 10, 10, 1, 0, 6, 0, 0, 0, 0, 0, 3, 0, 1, 10, 10, 10, 10, 3, 0, 1, 0, 2, 0, 0, 1, 10,
    0, 2, 0, 2, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 2, 0, 3, 10, 10, 10, 10, 2, 0, 3, 0, 3, 1, 3, 2, 10,
    0, 3, 1, 3, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 1, 0, 2, 1, 10, 10, 2, 1, 0, 2, 0, 0, 0, 0, 0, 10,
    0, 0, 0, 0, 10, 10, 10, 10, 2, 0, 3, 0, 10, 10, 10, 0, 5, 0, 0, 2, 10, 10, 3, 0, 0, 1, 2, 3, 1, 0, 10, 10,
    0, 1, 2, 3, 10, 10, 10, 1, 3, 0, 2, 0, 10, 10, 10, 10, 10, 10, 10, 3, 10, 10, 1, 0, 0, 10, 10, 10, 10, 10, 10, 10,
    0, 2, 0, 0, 0, 10, 10, 0, 0, 0, 1, 0, 0, 0, 0, 0, 6, 0, 10, 1, 10, 10, 11, 0, 0, 10, 0, 0, 1, 0, 10, 10,
    0, 3, 0, 10, 10, 10, 10, 10, 10, 0, 2, 0, 2, 3, 1, 3, 2, 0, 10, 10, 10, 10, 1, 0, 10, 10, 10, 0, 3, 2, 1, 10,
    0, 1, 0, 10, 10, 10, 10, 10, 10, 0, 3, 0, 1, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 2, 10,
    0, 3, 0, 10, 10, 0, 0, 10, 10, 0, 1, 0, 2, 3, 1, 3, 2, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 3, 1, 3, 10,
    0, 2, 0, 10, 10, 10, 10, 10, 10, 0, 3, 0, 0, 0, 0, 0, 7, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 2, 10, 10, 10,
    0, 1, 0, 10, 10, 10, 10, 10, 10, 0, 2, 0, 2, 3, 1, 3, 2, 0, 10, 10, 10, 0, 3, 0, 10, 10, 10, 0, 1, 2, 3, 10,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 12, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 10,
    0, 3, 1, 3, 2, 1, 2, 3, 1, 3, 2, 0, 2, 3, 1, 3, 2, 1, 2, 3, 0, 0, 1, 2, 3, 1, 3, 2, 1, 2, 3, 10,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10];
mapas.push(new Mapa(arrmapa18, 32 * 32, 16 * 32, dirMapa1));

let arrmapa19 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 0, 10, 0, 1, 1, 1, 1, 1, 1, 0, 10, 0, 9, 0,
    0, 1, 0, 10, 0, 1, 0, 0, 0, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 10, 0, 1, 0, 10, 10, 0, 1, 0, 10, 0, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 10, 10, 0, 1, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 0, 10, 10, 0, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
mapas.push(new Mapa(arrmapa19, 16 * 32, 16 * 32, dirMapa1));

window.onload = function () {
    canvas = document.getElementById("jogo");
    ctx = canvas.getContext("2d");

    canvasDado = document.getElementById("dado");
    ctxDado = canvasDado.getContext("2d");
    document.getElementById("contador").innerHTML = "0/" + maxPlayers;
}

function chechBoxClicado(id) {
    var currentCheckBox = document.getElementById(id);
    var checkBoxes = document.querySelectorAll(".checkbox");
    var numSelected = 0;
    checkBoxes.forEach(function (e) {
        if (e.checked) {
            numSelected++;
        }
    });
    if (numSelected > maxPlayers) {
        currentCheckBox.checked = false;
        numSelected--;
    }
    document.getElementById("contador").innerHTML = numSelected + "/" + maxPlayers;
}

function animarDado() {
    for (let x = 0; x < 128; x++) {
        //ctxDado.clearRect(0, 0, canvasDado.width, canvasDado.height);
        ctxDado.drawImage(tileSetDado, numDado * 32, 0, 32, 32, x, 0, 128, 128);

        console.log(x);
    }
}

function cyclePlayers() {
    if (currentPlayerIndex + 1 >= activePlayers.length) {
        currentPlayerIndex = 0;
    }
    else {
        currentPlayerIndex++;
    }
    console.log("CURRENT PLAYER INDEX = " + currentPlayerIndex);
}

function rodarDado() {
    numDado = getRandomInt(0, 5);
    canvasDado.style = "border: 3px solid #04AA6D";
    setTimeout(function () {
        canvasDado.style = "border: 3px solid white";
    }, 200);

    cyclePlayers();

    //animarDado();
}

function drawDado(number) {
    if (ctxDado == null) { return; }

    ctxDado.clearRect(0, 0, canvasDado.width, canvasDado.height);

    ctxDado.drawImage(tileSetDado, number * 32, 0, 32, 32, 0, 0, 128, 128);
}

function drawGame() {
    if (ctx == null) { return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDado(numDado);

    for (var y = 0, i = 0; y < currMap.mHeight; y += tHeight) {
        for (var x = 0; x < currMap.mWidth; x += tWidth) {
            switch (currMap.array[i]) {
                case 0: //casa null
                    ctx.drawImage(tileSetImage, 0, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 1: //casa vazia
                    ctx.drawImage(tileSetImage, 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 2: //positivo
                    ctx.drawImage(tileSetImage, 2 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    ctx.drawImage(tileSetImage, currMap.mapArray[i].modificador * 32, 2 * 32, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 3: //negativo
                    ctx.drawImage(tileSetImage, 3 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    ctx.drawImage(tileSetImage, currMap.mapArray[i].modificador * 32, 3 * 32, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 4: //santuario
                    ctx.drawImage(tileSetImage, 4 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 5: //aleatorio
                    ctx.drawImage(tileSetImage, 5 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 6: //teleport
                    ctx.drawImage(tileSetImage, 6 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 7: //cemiterio
                    ctx.drawImage(tileSetImage, 7 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 8: //inicio
                    ctx.drawImage(tileSetImage, 8 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 9: //fim
                    ctx.drawImage(tileSetImage, 9 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 10: //void 2
                    ctx.drawImage(tileSetImage, 10 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 11: //escolha
                    ctx.drawImage(tileSetImage, 11 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 12: //vai e volta
                    ctx.drawImage(tileSetImage, 12 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 13: //
                    ctx.drawImage(tileSetImage, 13 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                case 14: //
                    ctx.drawImage(tileSetImage, 14 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
                default:
                    ctx.drawImage(tileSetImage, 15 * 32, 0, tWidth, tHeight, x, y, tWidth, tHeight);
                    break;
            }

            for (var k = 0; k < activePlayers.length; k++) {
                //console.log("activePlayers[k].position = " + activePlayers[k].position + " i = " + i);
                if (activePlayers[k].position == i) {
                    ctx.drawImage(tileSetImage, (activePlayers[k].tipo - 1) * 32, 32, tWidth, tHeight, x, y, tWidth, tHeight);
                }
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
    let sel = 0;
    document.querySelectorAll(".checkbox").forEach(function (e) {
        if (e.checked) {
            sel++;
        }
    });
    if (sel == 0) {
        alert("Selecione os personagens!");
        return;
    }

    toggleScreen("mainmenu", false);
    toggleScreen("gamehidden", true);
    let jogadoresBtns = document.querySelectorAll(".checkbox");
    activePlayers = [];

    mapaSelecionado = parseInt(document.querySelector('input[name="mapselect"]:checked').value);
    currMap = mapas[mapaSelecionado - 1];
    console.log("mapa selecionado: " + mapaSelecionado);

    jogadoresBtns.forEach(function (e) {
        if (e.checked) {
            activePlayers.push(new Player(e.value, e.parentNode.querySelector(".radiobtn").querySelector("input").value));
            //esse monstro no indice 1 do vetor eh o nome do jogador ¯\_(ツ)_/¯
        }
    });

    console.log("Jogador ativo[0]: " + activePlayers[0].nome);

    canvasDado.style = "border: 3px solid white";

    canvas.width = currMap.mWidth;
    canvas.height = currMap.mHeight;
    drawGame();
}

function voltar() {
    toggleScreen("mainmenu", true);
    toggleScreen("gamehidden", false);
}