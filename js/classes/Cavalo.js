import { Peca } from './peca.js';

export class Cavalo extends Peca {
    constructor(cor) {
        super(cor);
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        this.getQuad().getTab().limparefem()
        const movimentos = [];
        const { linha, coluna } = posicaoAtual;

        const offsets = [
            { dLinha: -2, dColuna: -1 }, { dLinha: -2, dColuna: 1 },
            { dLinha: -1, dColuna: -2 }, { dLinha: -1, dColuna: 2 },
            { dLinha: 1, dColuna: -2 },  { dLinha: 1, dColuna: 2 },
            { dLinha: 2, dColuna: -1 },  { dLinha: 2, dColuna: 1 }
        ];

        for (const offset of offsets) {
            const novaLinha = linha + offset.dLinha;
            const novaColuna = coluna + offset.dColuna;

            if (tabuleiro.isPosicaoValida(novaLinha, novaColuna)) {
                const pecaAlvo = tabuleiro.getPeca(novaLinha, novaColuna);

                if (!pecaAlvo || pecaAlvo.cor !== this.cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
            }
        }
        return movimentos;
    }
}