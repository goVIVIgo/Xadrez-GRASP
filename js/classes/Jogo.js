

import { Tabuleiro } from './Tabuleiro.js';

import { Peca } from './peca.js';


import { IASilly } from './IASilly.js'; 


export class Jogo {
    #tabuleiro;
    #jogadorAtual;
    #estadoDoJogo;
    #alvoEnPassant;
    #ia;
    #aguardandoIA;
    modoDeJogo;

    constructor(modo = 'pvia') {
    this.#tabuleiro = new Tabuleiro();
    this.#tabuleiro.setself(this.#tabuleiro)
    this.#tabuleiro.iniciar()
    this.#jogadorAtual = 'branca';
    this.#estadoDoJogo = 'em_andamento';
    this.#alvoEnPassant = null;
    this.#aguardandoIA = false;

    this.pontos = {
        brancas: 39,
        pretas: 39
    };

    this.modoDeJogo = modo;
    this.#ia = null;
    if (this.modoDeJogo === 'pvia') {
        this.#ia = new IASilly();
    }

}

    settimers(timerBrancas,timerPretas){
        this.#tabuleiro.settimers(timerBrancas,timerPretas)
    
    }

    getAlvoEnPassant() {
        return this.#alvoEnPassant;

    }

    isAguardandoIA() {
        return this.#aguardandoIA;
    }

    getEstadoDoJogo() {
        return {
            matriz: this.#tabuleiro.matriz.map(linha => linha.map(q => q.getPeca())),
            jogadorAtual: this.#jogadorAtual,
            estado: this.#estadoDoJogo,
            historico: this.#tabuleiro.historico
        };
    }

    getTabuleiroObjeto() {
        return this.#tabuleiro;
    }


    getPontuacao(){
        return `brancas: ${this.pontos.brancas} pretas: ${this.pontos.pretas}`;
    }

    acionarJogadaIA() {
        if (this.modoDeJogo === 'pvia' && this.#jogadorAtual === 'preta' && this.#estadoDoJogo === 'em_andamento') {
            this.#aguardandoIA = true;
            this.#realizarJogadaIA();
            this.#aguardandoIA = false;
        }
    }

#realizarJogadaIA() {
        if (this.#estadoDoJogo !== 'em_andamento' || !this.#ia) return;
        const movimentoIA = this.#ia.escolherMovimento(this);

        if (movimentoIA) {
            this.tentarMoverPeca(movimentoIA.posInicial, movimentoIA.posFinal, true);
            window.dispatchEvent(new Event('estadoAtualizadoPelaIA'));
        } else {
            console.log("A IA não tem movimentos para fazer.");
        }
    }

    tentarMoverPeca(posInicial, posFinal) {

        if (this.#estadoDoJogo !== 'em_andamento') {
            console.log("Jogo terminou");
            return false;
        }

        const peca = this.#tabuleiro.getPeca(posInicial.linha, posInicial.coluna);
        if (!peca || peca.cor !== this.#jogadorAtual) {
            console.log(`Movimento inválido ou não é a vez do jogador: ${this.#jogadorAtual}`);
            return false;
        }


        console.log(posInicial)
        const movimentosValidos = peca.getMovimentosValidos(posInicial, this.#tabuleiro, this);
        const movimentoEscolhido = movimentosValidos.find(m => m.linha === posFinal.linha && m.coluna === posFinal.coluna);
        const ehMovimentoValido = movimentosValidos.some(m => m.linha === posFinal.linha && m.coluna === posFinal.coluna);



        if (!movimentoEscolhido) {
            console.log("Movimento inválido para a peça.");
            return false;
        }


        const destino = this.#tabuleiro.getPeca(posFinal.linha,posFinal.coluna)

        if(destino){
            if(destino.cor === 'branca'){
                this.pontos.brancas -= destino.valor;
                console.log("menos um ponto seu ruim")
            }else{
                console.log("HAHA MENOS UM")
             this.pontos.pretas -= destino.valor;
            }

        }
        // aqui o movimento é feito e já atualizado no histórico

        let proximoAlvoEnPassant = null;
        if (peca.tipo === 'peao' && Math.abs(posInicial.linha - posFinal.linha) === 2) {
            const direcao = peca.cor === 'branca' ? 1 : -1;
            proximoAlvoEnPassant = { linha: posInicial.linha - direcao, coluna: posInicial.coluna };
        }

        if (movimentoEscolhido.enPassant) {
            const direcaoOposta = peca.cor === 'branca' ? 1 : -1;
            this.#tabuleiro.removerPeca(posFinal.linha + direcaoOposta, posFinal.coluna);
        }

        this.#tabuleiro.moverPeca(posInicial, posFinal);
        this.#alvoEnPassant = proximoAlvoEnPassant;

        this.#verificarVitoria();
        if (this.#estadoDoJogo === 'em_andamento') {
            this.#trocarTurno();
        }

        return true;
    }

    #trocarTurno() {
        this.#jogadorAtual = this.#jogadorAtual === 'branca' ? 'preta' : 'branca';
    }

    #verificarVitoria() {
        const pecas = this.#tabuleiro.matriz.flat().map(q => q.getPeca());
        const temReiBranco = pecas.some(p => p && p.tipo === 'rei' && p.cor === 'branca');
        const temReiPreto = pecas.some(p => p && p.tipo === 'rei' && p.cor === 'preta');

        if (!temReiBranco) {
            this.#estadoDoJogo = 'vitoria_pretas';
            console.log("Pretas venceram");
        } else if (!temReiPreto) {
            this.#estadoDoJogo = 'vitoria_brancas';
            console.log("Brancas venceram");
        }
    }
}
