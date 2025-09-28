import { Peca } from './Peca.js';

export class Cavalo extends Peca {
    constructor(cor) {
        super(cor);
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
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

//Information Expert: a responsabilidade por uma ação deve ser atribuída à classe que tem a maior parte da informação necessária para realizá-la.
//No caso dos movimentos do cavalo, a classe Bispo tem toda a informação necessária para calcular seus movimentos válidos com base na posição atual e no estado do tabuleiro.