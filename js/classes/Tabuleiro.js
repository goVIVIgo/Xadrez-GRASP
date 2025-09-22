

import { Torre } from './torre.js';
import { Cavalo } from './cavalo.js';
import { Bispo } from './bispo.js';
import { Rainha } from './Rainha.js';
import { Rei } from './rei.js';
import { Peao } from './peao.js';
import { Quadrado } from './Quadrado.js';

export class Tabuleiro {
    constructor() {

        this.layout = [Torre, Cavalo, Bispo, Rainha, Rei, Bispo, Cavalo, Torre];
        this.matriz = [];
        this.historico = [];
        this.iniciar();

    }

    iniciar() {

        for (let linha = 0; linha < 8; linha++) {
            this.matriz[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                this.matriz[linha][coluna] = new Quadrado();
            }
        }


        for (let coluna = 0; coluna < 8; coluna++) {

            this.matriz[0][coluna].setPeca(new this.layout[coluna]('preta'));
            this.matriz[7][coluna].setPeca(new this.layout[coluna]('branca'));
        }


        for (let coluna = 0; coluna < 8; coluna++) {

            this.matriz[1][coluna].setPeca(new Peao('preta'));
            this.matriz[6][coluna].setPeca(new Peao('branca'));
        }

        console.log("tabuleiro aberto, jogo começpi");
    }

    
    getPeca(linha, coluna) {
        if (!this.isPosicaoValida(linha, coluna)) return null;

        const quadrado = this.matriz[linha][coluna];
        return quadrado.getPeca();
    }


    moverPeca(posInicial, posFinal) {
        const peca = this.getPeca(posInicial.linha, posInicial.coluna);
        const quadradoInicial = this.matriz[posInicial.linha][posInicial.coluna];
        const quadradoFinal = this.matriz[posFinal.linha][posFinal.coluna];

        quadradoFinal.setPeca(peca);
        quadradoInicial.setPeca(null);

        this.historico.push(`${this.posicaoParaNotacao(posInicial)} -> ${this.posicaoParaNotacao(posFinal)}`);

    }
    
    getUltimoMovimento() {
    return this.historico[this.historico.length - 1];
    } // pedro ve se esse método serve

    posicaoParaNotacao(pos) {
        const colunas = ['a','b','c','d','e','f','g','h'];
        return `${colunas[pos.coluna]}${8 - pos.linha}`;
    }
    isPosicaoValida(linha, coluna) {
        return linha >= 0 && linha < 8 && coluna >= 0 && coluna < 8;
    }
}