import { Peca } from './peca.js';

export class Rei extends Peca {
    constructor(cor) {
        super(cor);
    }

    get tipo() {
        return 'rei'; 
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        const movimentos = [];
        const { linha, coluna } = posicaoAtual;

        const offsets = [
            { dLinha: -1, dColuna: 0 }, { dLinha: 1, dColuna: 0 },
            { dLinha: 0, dColuna: -1 }, { dLinha: 0, dColuna: 1 },
            { dLinha: -1, dColuna: -1 }, { dLinha: -1, dColuna: 1 },
            { dLinha: 1, dColuna: -1 },  { dLinha: 1, dColuna: 1 }
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

        // tem que mplementar a lógica do Roque (trocar rei com torre) e a validação para impedir que o Rei se mova para uma posição de xeque e se mate.

        return movimentos;
    }
}