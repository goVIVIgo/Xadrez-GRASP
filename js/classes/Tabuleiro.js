import { Torre } from './torre.js';
import { Cavalo } from './cavalo.js';
import { Bispo } from './bispo.js';
import { Rei } from './rei.js';
import { Rainha } from './Rainha.js';
import { Quadrado } from './quadrado.js';
import { Peao } from './Peao.js';


export class Tabuleiro {
    constructor() {
        this.layout = [Torre, Cavalo, Bispo, Rei, Rainha, Bispo, Cavalo, Torre];
        this.matriz = [];
        this.iniciar(); //to so chamando o medoto de iniciar no construtor msm
    }

    iniciar() {
        for (let linha = 0; linha < 8; linha++) {
            this.matriz[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                var a = new Quadrado();
                this.matriz[linha][coluna] = a;
            }
        }
        console.log("fucnqowiidqiqod mwerrdad ")

        for (let coluna = 0; coluna < 8; coluna++) {
            this.matriz[0][coluna].setPeca(new this.layout[coluna](true));
    }
        for (let coluna = 0; coluna < 8; coluna++) {
            this.matriz[7][coluna].setPeca(new this.layout[coluna](false));
    }
        for (let coluna = 0; coluna < 8; coluna++) {
            this.matriz[1][coluna].setPeca(new Peao(true));
    }
        for (let coluna = 0; coluna < 8; coluna++) {
            this.matriz[6][coluna].setPeca(new Peao(false));
    }
    }

    get_quadrado(coord){
        if(coord[0]<0 || coord[0]>7 || coord[1]<0 || coord[1]>7){return null}
        return matriz[coord[0]][coord[1]]
    }

}