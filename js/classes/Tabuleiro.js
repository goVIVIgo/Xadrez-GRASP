

import { Torre } from './torre.js';
import { Cavalo } from './cavalo.js';
import { Bispo } from './bispo.js';
import { Rainha } from './Rainha.js';
import { Rei } from './Rei.js';
import { Peao } from './Peao.js';
import { Quadrado } from './quadrado.js';

export class Tabuleiro {
    constructor() {

        this.layout = [Torre, Cavalo, Bispo, Rainha, Rei, Bispo, Cavalo, Torre];
        this.matriz = [];
        this.historico = [];
        // this.iniciar();
        this.todas = [];
        this.self;
        this.timerBrancas
        this.timerPretas

    }

    setself(self){
        this.self = self
    }

    settimers(a, b){
        this.timerBrancas = a
        this.timerPretas = b
    }

    iniciar() {

        for (let linha = 0; linha < 8; linha++) {
            this.matriz[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                this.matriz[linha][coluna] = new Quadrado(this.self,[coluna,linha]);
                this.matriz[linha][coluna].setself(this.matriz[linha][coluna])
            }
        }


        for (let coluna = 0; coluna < 8; coluna++) {

            this.matriz[0][coluna].setPeca(new this.layout[coluna]('preta'));
            this.matriz[7][coluna].setPeca(new this.layout[coluna]('branca'));

            // console.log(this.matriz[0][coluna].getPeca().tipo)
        }


        for (let coluna = 0; coluna < 8; coluna++) {

            this.matriz[1][coluna].setPeca(new Peao('preta'));
            this.matriz[6][coluna].setPeca(new Peao('branca'));

        }

        console.log("tabuleiro aberto, jogo começou");
    }

    
    getPeca(linha, coluna) {
        if (!this.isPosicaoValida(linha, coluna)) return null;

        const quadrado = this.matriz[linha][coluna];
        return quadrado.getPeca();
    }

    getQuad(linha, coluna) {
        if (!this.isPosicaoValida(linha, coluna)) return null;

        const quadrado = this.matriz[linha][coluna];
        return quadrado
    }

    moverPeca(posInicial, posFinal) {
        const peca = this.getPeca(posInicial.linha, posInicial.coluna);
        const quadradoInicial = this.matriz[posInicial.linha][posInicial.coluna];
        const quadradoFinal = this.matriz[posFinal.linha][posFinal.coluna];

        if (!peca) return;

        const pecaCapturada = quadradoFinal.getPeca();

        quadradoFinal.setPeca(peca);
        quadradoInicial.setPeca(null);

        if (peca.andou) {
            peca.andou(posInicial, posFinal);
        }

        if (pecaCapturada != null) {
            const index = this.todas.indexOf(pecaCapturada);
            if (index > -1) {
                this.todas.splice(index, 1);
            }
        }

        var tempo;
        if (peca.cor == 'branca') {
            tempo = this.timerBrancas.formatarTempo();
        } else {
            tempo = this.timerPretas.formatarTempo();
        }
        this.historico.push(`${this.posicaoParaNotacao(posInicial)} -> ${this.posicaoParaNotacao(posFinal)} ||` + tempo);

        this.waveupdate();
    }
    
    waveupdate(){
        for (let index = 0; index < this.todas.length; index++) {
            const element = this.todas[index];
            element.ameacar(this.self)
        }
    }

    pularhistorico(){
        this.historico.push("")
    }

    getUltimoMovimento() {
    return this.historico[this.historico.length - 1];
    } // pedro ve se esse método serve

    removerPeca(linha, coluna) { //especial pro en passant
        if (this.isPosicaoValida(linha, coluna)) {
            this.matriz[linha][coluna].setPeca(null);
        }
    }

    posicaoParaNotacao(pos) {
        const colunas = ['a','b','c','d','e','f','g','h'];
        return `${colunas[pos.coluna]}${8 - pos.linha}`;
    }
    isPosicaoValida(linha, coluna) {
        return linha >= 0 && linha < 8 && coluna >= 0 && coluna < 8;
    }

    incluir(peca){
        if(!this.todas.includes(peca)){
            this.todas.push(peca)
            peca.setself(peca)
        }
    }

    getTodas(){
        return this.todas
    }

    talivre(coord){
        if(this.matriz[coord[1]][coord[0]].getPeca() == null){
            return true
        }
        return false
    }

    taseguro(quad, rei){
        console.log("checando seguranca")
        for (let index = 0; index < this.todas.length; index++) {
            const element = this.todas[index];
            if(element.cor != rei.cor){
                var a = element.getAmeaca(this.dicionarizarposicao(element.getQuad()),this.self) // aqui agr eu tenho uma array de dicionarios cm as posicoes possiveis
                console.log(a)
                console.log(this.dicionarizarposicao(quad))
                if(this.inclui(a,this.dicionarizarposicao(quad))){
                    console.log("nao esta seguro")
                    return false
        }}}
        return true
    }

    dicionarizarposicao(quad){
        return {linha: quad.coord[1], coluna: quad.coord[0]}
    }

    inclui(arraydedicionarios, dicionario){
        for (let index = 0; index < arraydedicionarios.length; index++) {
            const element = arraydedicionarios[index];
            if(element.linha == dicionario.linha && element.coluna == dicionario.coluna){
                return true
        }}
        return false
    }

    checkformate(rei){
        console.log(rei)
        var aliados = []
        var oponentes = []
        for (let index = 0; index < this.todas.length; index++) {
            const element = this.todas[index];
            element.storecoord()
            if(element.cor == rei.cor){aliados.push(element)}else{oponentes.push(element)}
        }
        console.log(aliados.length)
        for (let index = 0; index < aliados.length; index++) {
            const element = aliados[index];
            if(element.protege(rei,oponentes,this.self)){
                console.log("e nao foi q protegeu msm")
                this.tryagain()
                return false}
        }
        return true
    }

    tryagain(){
        for (let index = 0; index < this.todas.length; index++) {
            const element = this.todas[index];
            element.tryagain()
        }
    }

    removerPecaDaLista(pecaParaRemover) {
        if (!pecaParaRemover) return;
        const index = this.todas.indexOf(pecaParaRemover);
        if (index > -1) {
            this.todas.splice(index, 1);
        }
    }

    getPecasDoJogador(cor) {
        const pecasDoJogador = [];
        for (const peca of this.todas) {
            if (peca.cor === cor) {
                const pos = this.dicionarizarposicao(peca.getQuad());
                pecasDoJogador.push({ peca, pos });
            }
        }
        return pecasDoJogador;
    }

    getRei(cor) {
        for (const peca of this.todas) {
            if (peca.tipo === 'rei' && peca.cor === cor) {
                return peca;
            }
        }
        return null;
    }

}