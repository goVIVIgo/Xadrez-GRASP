

import { Tabuleiro } from './Tabuleiro.js';

import { Peca } from './Peca.js';

import { Rainha } from './Rainha.js';
import { Torre } from './Torre.js';
import { Bispo } from './Bispo.js';
import { Cavalo } from './Cavalo.js';
import { Rei } from './Rei.js';
import { Peao } from './Peao.js';



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
    this.promocaoPendente = null;
    this.reiEmXeque = null;


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


    getPontos() {
        return this.pontos;
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

        const linhaFinal = posFinal.linha;
        const ehPeao = peca.tipo === 'peao';
        const ehLinhaFinalBranca = peca.cor === 'branca' && linhaFinal === 0;
        const ehLinhaFinalPreta = peca.cor === 'preta' && linhaFinal === 7;

        if (ehPeao && (ehLinhaFinalBranca || ehLinhaFinalPreta)) {
            this.promocaoPendente = { pos: posFinal, cor: peca.cor };

            return true;
        }

        this.#verificarVitoria();
        if (this.#estadoDoJogo === 'em_andamento') {
            this.#trocarTurno();
        }

        return true;
    }

    executarPromocao(tipoPeca) {
    if (!this.promocaoPendente) return;

    const { pos, cor } = this.promocaoPendente;

    const peaoASerRemovido = this.#tabuleiro.getPeca(pos.linha, pos.coluna);
    if (peaoASerRemovido) {
        this.#tabuleiro.removerPecaDaLista(peaoASerRemovido);
    }
    let novaPeca;

    try {

        switch (tipoPeca) {
            case 'rainha': novaPeca = new Rainha(cor); break;
            case 'torre': novaPeca = new Torre(cor); break;
            case 'bispo': novaPeca = new Bispo(cor); break;
            case 'cavalo': novaPeca = new Cavalo(cor); break;
            default: novaPeca = new Rainha(cor);
        }

        this.#tabuleiro.incluir(novaPeca);
        this.#tabuleiro.matriz[pos.linha][pos.coluna].setPeca(novaPeca);


    } catch (error) {

        console.error("errro na promoção");
        console.error("peça escolhida:", tipoPeca);
        console.error(error);
    }


    this.promocaoPendente = null;
    this.#verificarVitoria();
    if (this.#estadoDoJogo === 'em_andamento') {
        this.#trocarTurno();
    }
}

    #trocarTurno() {
        this.#jogadorAtual = this.#jogadorAtual === 'branca' ? 'preta' : 'branca';
    }

    #verificarVitoria() {
    this.reiEmXeque = null;

    const corOponente = this.#jogadorAtual === 'branca' ? 'preta' : 'branca';
    const reiOponente = this.#tabuleiro.getRei(corOponente);

    if (!reiOponente) {
        return;
    }

    const posReiOponente = this.#tabuleiro.dicionarizarposicao(reiOponente.getQuad());
    const estaEmXeque = this.isPosicaoAtacada(posReiOponente, this.#jogadorAtual);

    if (estaEmXeque) {
        this.reiEmXeque = posReiOponente;
        if (this.#tabuleiro.checkformate(reiOponente)) {
            console.log("XEQUE-MATE CONFIRMADO BB AVISAH!");
            this.#estadoDoJogo = this.#jogadorAtual === 'branca' ? 'vitoria_brancas_xeque_mate' : 'vitoria_pretas_xeque_mate';
        } else {
            this.#estadoDoJogo = 'em_xeque';
            console.log("alarme falso, rei eh uma piranha patetica");
        }
    } else {
        this.#estadoDoJogo = 'em_andamento';
    }
}

    isPosicaoAtacada(posicao, corAtacante) {
    const todasPecas = this.#tabuleiro.getPecasDoJogador(corAtacante);
    for (const { peca, pos } of todasPecas) {
        const movimentosDeAtaque = peca.getAmeaca(pos, this.#tabuleiro, this);
        if (movimentosDeAtaque.some(mov => mov.linha === posicao.linha && mov.coluna === posicao.coluna)) {
            return true;
        }
    }
    return false;
    }
}
