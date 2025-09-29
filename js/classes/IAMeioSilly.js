import { IAMae } from './IAMae.js';

export class IAMeioSilly extends IAMae {
    escolherMovimento(jogo) {
        const tabuleiro = jogo.getTabuleiroObjeto();
        const corIA = jogo.getEstadoDoJogo().jogadorAtual;

        const todosOsMovimentosLegais = this._gerarMovimentosLegais(jogo);

        if (todosOsMovimentosLegais.length === 0) {
            return null;
        }

        const movimentosDeCaptura = todosOsMovimentosLegais.filter(movimento => {
            const pecaAlvo = tabuleiro.getPeca(movimento.posFinal.linha, movimento.posFinal.coluna);
            return pecaAlvo && pecaAlvo.cor !== corIA;
        });

        let movimentoEscolhido;
        if (movimentosDeCaptura.length > 0) {
            const indiceAleatorio = Math.floor(Math.random() * movimentosDeCaptura.length);
            movimentoEscolhido = movimentosDeCaptura[indiceAleatorio];
        } else {
            const indiceAleatorio = Math.floor(Math.random() * todosOsMovimentosLegais.length);
            movimentoEscolhido = todosOsMovimentosLegais[indiceAleatorio];
        }

        console.log("movimento aplicado:", movimentoEscolhido);
        return movimentoEscolhido;
    }
}