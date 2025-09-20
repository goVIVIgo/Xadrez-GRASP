import { Torre } from './torre.js';
import { Cavalo } from './cavalo.js';
import { Bispo } from './bispo.js';
import { Rei } from './rei.js';
import { Rainha } from './Rainha.js';
import { Quadrado } from './quadrado.js';


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
}

 getPeca(linha, coluna) { // pedro era isso aqui que tu tvaa pensando????????
    if (!this.isPosicaoValida(linha, coluna)) return null;


    const quadrado = this.matriz[linha][coluna];

    return quadrado.getPeca();
}

}