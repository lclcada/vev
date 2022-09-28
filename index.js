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
    direct;

    constructor(array, mWidth, mHeight, direct) {
        this.array = array;
        this.mWidth = mWidth;
        this.mHeight = mHeight;

        var mapArray = [];
        for (let i = 0; i < array.length; i++) {
            let tp = null, mod = null, dir = null;
            let enabledArray = [], disabledArray = [];
            tp = array[i];
            dir = direct[i];

            if (array[i] == 2) {
                let posEnabled = 0;
                for (let j = 0; j < positiveList.length; j++) {
                    if (positiveList[j][1] == true) {
                        enabledArray[posEnabled] = positiveList[j][0];
                        posEnabled++;
                    }
                }
                if (posEnabled == 0) { alert("¯\_(ツ)_/¯"); break; }
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
                if (posDisabled == 0) { alert("¯\_(ツ)_/¯"); break; }
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
        this.movementModifier = 1;
    }

    findValidBackwardsDirections(posicao) {
        let out = [];
        switch (currMap.mapArray[posicao].direcao) {
            case r:
                if (currMap.mapArray[posicao - 1].tipo != 0) out.push(l);
                if (currMap.mapArray[posicao + (currMap.mWidth / 32)].tipo != 0) out.push(d);
                if (currMap.mapArray[posicao - (currMap.mWidth / 32)].tipo != 0) out.push(u);
                break;
            case l:
                if (currMap.mapArray[posicao + 1].tipo != 0) out.push(r);
                if (currMap.mapArray[posicao + (currMap.mWidth / 32)].tipo != 0) out.push(d);
                if (currMap.mapArray[posicao - (currMap.mWidth / 32)].tipo != 0) out.push(u);
                break;
            case d:
                if (currMap.mapArray[posicao + 1].tipo != 0) out.push(r);
                if (currMap.mapArray[posicao - 1].tipo != 0) out.push(l);
                if (currMap.mapArray[posicao - (currMap.mWidth / 32)].tipo != 0) out.push(u);
                break;
            case u:
                if (currMap.mapArray[posicao + 1].tipo != 0) out.push(r);
                if (currMap.mapArray[posicao - 1].tipo != 0) out.push(l);
                if (currMap.mapArray[posicao + (currMap.mWidth / 32)].tipo != 0) out.push(d);
                break;
        }
        console.log("valid backwards:" + out[0]);
        return out;
    }

    verifyValid(posicao) {
        if (currMap.mapArray[posicao].tipo == 0) return false;
        console.log("VERIFICADO: " + posicao);
        return true;
    }

    checkCurrentHouse() { //returns true if it has reached a house with no further possible movement. else returns false
        //console.log("Tipo da casa atual: " + currMap.mapArray[this.position].tipo);
        switch (currMap.mapArray[this.position].tipo) {
            case 0:
                alert("erro! foi pra uma casa null. contate o desenvolvedor");
                return true;
                break;
            case 1:
                return true;
                break;
            case 2:
                switch (currMap.mapArray[this.position].modificador) {
                    case 0:
                        console.log("+1");
                        this.moveAux(1);
                        break;
                    case 1:
                        console.log("+3");
                        this.moveAux(3);
                        break;
                    case 2:
                        console.log("+10");
                        this.moveAux(10);
                        break;
                    case 3:
                        console.log("x2");
                        this.movementModifier = 2;
                        return true;
                        break;
                    case 4:
                        console.log("jogue de novo ainda nao foi implementado");
                        return true;
                        break;
                    default:
                        alert("erro nos mods positivos");
                }
                break;
            case 3:
                switch (currMap.mapArray[this.position].modificador) {
                    case 0:
                        console.log("-1");
                        this.moveAux(-1);
                        break;
                    case 1:
                        console.log("-3");
                        this.moveAux(-3);
                        break;
                    case 2:
                        console.log("-10");
                        this.moveAux(-10);
                        break;
                    case 3:
                        console.log("/2");
                        this.movementModifier = 0.5;
                        return true;
                        break;
                    case 4:
                        console.log("perdeu a vez ainda nao foi implementado");
                        return true;
                        break;
                    default:
                        alert("erro nos mods positivos");
                }
                break;
            case 9:
                alert("ganhou");
                break;
        }
        return false;
    }

    move(n) {
        if (n == 0) return;
        if (this.movementModifier != 1) this.movementModifier = 1;

        this.moveAux(n);
        let state = false;
        do {
            state = this.checkCurrentHouse();
        } while (!state);
        do {
            this.moveAux(1);

            console.log("Tipo da casa atual: " + currMap.mapArray[this.position].tipo);
            switch (currMap.mapArray[this.position].tipo) {
                case 2:
                    switch (currMap.mapArray[this.position].modificador) {
                        case 0:
                            console.log("+1");
                            this.moveAux(1);
                            break;
                        case 1:
                            console.log("+3");
                            this.moveAux(3);
                            break;
                        case 2:
                            console.log("+10");
                            this.moveAux(10);
                            break;
                        case 3:
                            console.log("x2");
                            this.movementModifier = 2;
                            break;
                        case 4:
                            alert("jogue de novo ainda nao foi implementado");
                            break;
                        default:
                            alert("erro nos mods positivos");
                    }
                    break;
                case 3:
                    switch (currMap.mapArray[this.position].modificador) {
                        case 0:
                            console.log("-1");
                            this.moveAux(-1);
                            break;
                        case 1:
                            console.log("-3");
                            this.moveAux(-3);
                            break;
                        case 2:
                            console.log("-10");
                            this.moveAux(-10);
                            break;
                        case 3:
                            console.log("/2");
                            this.movementModifier = 0.5;
                            break;
                        case 4:
                            alert("perdeu a vez ainda nao foi implementado");
                            break;
                        default:
                            alert("erro nos mods positivos");
                    }
                    break;
                case 9:
                    alert("ganhou");
                    break;
            }
            moved++;
        } while (moved < goalMoved);
    }

    moveAux(n) {
        let count = 0;
        if (n > 0) {
            do {
                switch (currMap.mapArray[this.position].direcao) {
                    case r:
                        if (!this.verifyValid(this.position + 1)) return;
                        this.position++;
                        break;
                    case l:
                        if (!this.verifyValid(this.position - 1)) return;
                        this.position--;
                        break;
                    case d:
                        if (!this.verifyValid(this.position + (currMap.mWidth / 32))) return;
                        this.position += currMap.mWidth / 32;
                        break;
                    case u:
                        if (!this.verifyValid(this.position - (currMap.mWidth / 32))) return;
                        this.position -= currMap.mWidth / 32;
                        break;
                    default:
                        alert("erro de movimento pos"); return;
                }
                count++;
            } while (count < n);
        }
        else if (n < 0) {
            console.log("andando pra tras");
            do {
                console.log("DO NEG count=" + count);
                switch (this.findValidBackwardsDirections(this.position)[0]) {
                    case r:
                        if (!this.verifyValid(this.position + 1)) return;
                        this.position++;
                        break;
                    case l:
                        if (!this.verifyValid(this.position - 1)) return;
                        this.position--;
                        break;
                    case d:
                        if (!this.verifyValid(this.position + (currMap.mWidth / 32))) return;
                        this.position += currMap.mWidth / 32;
                        break;
                    case u:
                        if (!this.verifyValid(this.position - (currMap.mWidth / 32))) return;
                        this.position -= currMap.mWidth / 32;
                        break;
                    default:
                        alert("erro de movimento neg"); return;
                }
                count--;
            } while (count >= n);
        }
        else alert("erro! parametro invalido passado ao moveAux()");
    }
}

var mapas = [];

let dirMapa1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, d, 0,
    0, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, 0,
    0, d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, d, 0,
    0, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, 0,
    0, d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, d, 0,
    0, d, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, 0,
    0, d, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, r, r, r, r, r, r, r, r, r, r, r, r, r, r, r, d, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, d, 0,
    0, e, l, l, l, l, l, l, l, l, l, l, l, l, l, l, l, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let arrMapa1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0,
    0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 0,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0,
    0, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 0,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 9, 2, 2, 1, 3, 3, 1, 2, 2, 1, 3, 3, 1, 2, 2, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
    console.log("---NUM DADO = " + (numDado + 1));
    canvasDado.style = "border: 3px solid #04AA6D";
    setTimeout(function () {
        canvasDado.style = "border: 3px solid white";
    }, 200);

    cyclePlayers();
    activePlayers[currentPlayerIndex].move(numDado + 1);

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
    document.querySelectorAll(".checkbox").forEach(function (e) { if (e.checked) { sel++; } });
    if (sel == 0) {
        alert("Selecione pelo menos um personagem!");
        return;
    }

    toggleScreen("mainmenu", false);
    toggleScreen("gamehidden", true);

    activePlayers = [];

    mapaSelecionado = parseInt(document.querySelector('input[name="mapselect"]:checked').value);
    currMap = mapas[mapaSelecionado - 1];
    console.log("mapa selecionado: " + mapaSelecionado);

    document.querySelectorAll(".checkbox").forEach(function (e) {
        if (e.checked) {
            activePlayers.push(new Player(e.value, e.parentNode.querySelector(".radiobtn").querySelector("input").value));
            //esse monstro no indice 1 do vetor eh o nome do jogador ¯\_(ツ)_/¯
        }
    });

    canvasDado.style = "border: 3px solid white";

    canvas.width = currMap.mWidth;
    canvas.height = currMap.mHeight;
    drawGame();
}

function voltar() {
    toggleScreen("mainmenu", true);
    toggleScreen("gamehidden", false);
}