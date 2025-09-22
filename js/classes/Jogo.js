

import { Tabuleiro } from './Tabuleiro.js';

export class Jogo {
    #tabuleiro;
    #jogadorAtual;
    #estadoDoJogo;

    constructor() {
        this.#tabuleiro = new Tabuleiro();
        this.#jogadorAtual = 'branca';
        this.#estadoDoJogo = 'em_andamento';
    }

    getEstadoDoJogo() {
        return {
            matriz: this.#tabuleiro.matriz.map(linha => linha.map(q => q.getPeca())),
            jogadorAtual: this.#jogadorAtual,
            estado: this.#estadoDoJogo,
            historico: this.#tabuleiro.historico // p puxar o histórico
        };
    }
    
    getTabuleiroObjeto() {
        return this.#tabuleiro;
    }

    tentarMoverPeca(posInicial, posFinal) {
        if (this.#estadoDoJogo !== 'em_andamento') {
            console.log("jogo  terminou");
            return false;
        }
        
        const peca = this.#tabuleiro.getPeca(posInicial.linha, posInicial.coluna);
        if (!peca) return false;
        if (peca.cor !== this.#jogadorAtual) {
            console.log(`no puede ${this.#jogadorAtual}`);
            return false;
        }

        const movimentosValidos = peca.getMovimentosValidos(posInicial, this.#tabuleiro);
        const ehMovimentoValido = movimentosValidos.some(m => m.linha === posFinal.linha && m.coluna === posFinal.coluna);

        if (!ehMovimentoValido) {
            console.log("no puede");
            return false;
        }

        this.#tabuleiro.moverPeca(posInicial, posFinal);

        this.#verificarVitoria();

        if (this.#estadoDoJogo === 'em_andamento') {
            this.#trocarTurno();
        }

        return true;
    }
    
    #trocarTurno() {
        this.#jogadorAtual = this.#jogadorAtual === 'branca' ? 'preta' : 'branca';
    }

    #verificarVitoria() { //tem que fazer isso aqui ser visivel de forma bonitinha no front, ele so ta parando o jpgp por e falando quem venceu por enquanto
        const pecas = this.#tabuleiro.matriz.flat().map(q => q.getPeca());
        
        const temReiBranco = pecas.some(p => p && p.tipo === 'rei' && p.cor === 'branca');
        const temReiPreto = pecas.some(p => p && p.tipo === 'rei' && p.cor === 'preta');

        if (!temReiBranco) {
            this.#estadoDoJogo = 'vitoria_pretas';
            console.log("pretas venceram");
        } else if (!temReiPreto) {
            this.#estadoDoJogo = 'vitoria_brancas';
            console.log("brancas enceram");
        }
    }
}