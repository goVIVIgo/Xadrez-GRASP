import { IAMae } from './IAMae.js';

export class IANaoSilly extends IAMae {
    escolherMovimento(jogo) {
        const tabuleiro = jogo.getTabuleiroObjeto();
        const corIA = jogo.getEstadoDoJogo().jogadorAtual;

        const todosOsMovimentosLegais = this._gerarMovimentosLegais(jogo);

        if (todosOsMovimentosLegais.length === 0) {
            return null;
        }

        const movimentosComPontuacao = todosOsMovimentosLegais.map(movimento => {
            return {
                movimento: movimento,
                pontuacao: this.#avaliarMovimento(movimento, tabuleiro, corIA)
            };
        });

        const maiorPontuacao = Math.max(...movimentosComPontuacao.map(item => item.pontuacao));

        const melhoresMovimentos = movimentosComPontuacao
            .filter(item => item.pontuacao === maiorPontuacao)
            .map(item => item.movimento);

        const indiceAleatorio = Math.floor(Math.random() * melhoresMovimentos.length);
        const movimentoEscolhido = melhoresMovimentos[indiceAleatorio];

        console.log(`IA NAO SILLY: Encontrou ${melhoresMovimentos.length} melhores movimentos com pontuação ${maiorPontuacao}`);
        console.log("movimento aplicado:", movimentoEscolhido);
        return movimentoEscolhido;
    }

    #avaliarMovimento(movimento, tabuleiro, corIA) {
        const pecaAlvo = tabuleiro.getPeca(movimento.posFinal.linha, movimento.posFinal.coluna);
        let pontuacao = 0;
        if (pecaAlvo && pecaAlvo.cor !== corIA) {
            pontuacao = pecaAlvo.valor;
        }
        pontuacao += Math.random() * 0.1;
        return pontuacao;
    }
}