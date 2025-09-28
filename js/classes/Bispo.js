import { Peca } from './peca.js';

export class Bispo extends Peca {
    constructor(cor) {
        super(cor);
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        const movimentos = [];

        const direcoes = [
            { dLinha: -1, dColuna: -1 },
            { dLinha: -1, dColuna: 1 },
            { dLinha: 1, dColuna: -1 },
            { dLinha: 1, dColuna: 1 }
        ];

        for (const direcao of direcoes) {
            var novaLinha = posicaoAtual.linha + direcao.dLinha;
            var novaColuna = posicaoAtual.coluna + direcao.dColuna;

            while (tabuleiro.isPosicaoValida(novaLinha, novaColuna)) {
                const pecaAlvo = tabuleiro.getPeca(novaLinha, novaColuna);

                if (!pecaAlvo) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                } else {
                    if (pecaAlvo.cor !== this.cor) {
                        movimentos.push({ linha: novaLinha, coluna: novaColuna });
                    }

                    break;
                }

                novaLinha += direcao.dLinha;
                novaColuna += direcao.dColuna;
            }
        }
        return movimentos;
    }
}

//Information Expert: a responsabilidade por uma ação deve ser atribuída à classe que tem a maior parte da informação necessária para realizá-la.
//No caso dos movimentos do bispo, a classe Bispo tem toda a informação necessária para calcular seus movimentos válidos com base na posição atual e no estado do tabuleiro.