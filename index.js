var ctx = null, canvas = null, ctxDado = null, canvasDado = null;
var currMap = null, maxPlayers = 5;

const l = "l", r = "r", u = "u", d = "d", e = "end";
const tWidth = 32, tHeight = tWidth;

var numDado = 0;
var numberOfPlayers = 1;
var mapaSelecionado = 1;

var tileSetImage = new Image();
var tileSetDado = new Image();

var positiveList = [[0, true], [1, true], [2, true], [3, true], [4, true]];
var negativeList = [[0, true], [1, true], [2, true], [3, true], [4, true]];
//0 = +-1
//1 = +-3
//2 = +-10
//3 = x/2
//4 = jdn/pav
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
        this.array = array; //quando for passar a array, adicionar explicitamente o inicio e o fim, e garantir o tamanho.
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

let dirMapa1 = [d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, d, d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, d, d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, d, d, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, e];
let arrMapa1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mapa1 = new Mapa(arrMapa1, 18 * 32, 18 * 32, dirMapa1);

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
const mapa2 = new Mapa(arrMapa2, 18 * 32, 18 * 32, dirMapa1);

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
const mapa3 = new Mapa(arrMapa3, 26 * 32, 18 * 32, dirMapa1);

let arrMapa4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 9, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const mapa4 = new Mapa(arrMapa4, 16 * 32, 7 * 32, dirMapa1);

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
const mapa5 = new Mapa(arrmapa5, 32 * 32, 16 * 32, dirMapa1);

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
const mapa6 = new Mapa(arrmapa6, 24 * 32, 17 * 32, dirMapa1);

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
const mapa7 = new Mapa(arrmapa7, 16 * 32, 16 * 32, dirMapa1);

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
const mapa8 = new Mapa(arrmapa8, 16 * 32, 16 * 32, dirMapa1);

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
const mapa9 = new Mapa(arrmapa9, 24 * 32, 16 * 32, dirMapa1);

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
const mapa10 = new Mapa(arrmapa10, 16 * 32, 16 * 32, dirMapa1);

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
const mapa11 = new Mapa(arrmapa11, 10 * 32, 10 * 32, dirMapa1);

let arrmapa12 = [];
const mapa12 = new Mapa(arrmapa12, 32 * 32, 16 * 32, dirMapa1);

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

function rodarDado() {
    numDado = getRandomInt(0, 5);
    canvasDado.style = "border: 3px solid #04AA6D";
    setTimeout(function () {
        canvasDado.style = "border: 3px solid white";
    }, 200);

    animarDado();
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
    toggleScreen("gamehidden", true);
    canvasDado.style = "border: 3px solid white";

    mapaSelecionado = parseInt(document.querySelector('input[name="mapselect"]:checked').value);
    //console.log("numero de players: " + numberOfPlayers);
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
        case 5:
            currMap = mapa5;
            break;
        case 6:
            currMap = mapa6;
            break;
        case 7:
            currMap = mapa7;
            break;
        case 8:
            currMap = mapa8;
            break;
        case 9:
            currMap = mapa9;
            break;
        case 10:
            currMap = mapa10;
            break;
        case 11:
            currMap = mapa11;
            break;
        case 12:
            currMap = mapa12;
            break;
        default:
            currMap = mapa1;
    }
    canvas.width = currMap.mWidth;
    canvas.height = currMap.mHeight;
    drawGame();
}

function voltar() {
    toggleScreen("mainmenu", true);
    toggleScreen("gamehidden", false);
}