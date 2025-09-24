import { Peca } from './peca.js';

export class Rainha extends Peca {
    constructor(cor) {
        super(cor);
    }

    get tipo() {
        return 'rainha'; 
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        this.getQuad().getTab().limparefem()
        const movimentos = [];

        const direcoes = [

            { dLinha: -1, dColuna: 0 }, { dLinha: 1, dColuna: 0 },
            { dLinha: 0, dColuna: -1 }, { dLinha: 0, dColuna: 1 },

            { dLinha: -1, dColuna: -1 }, { dLinha: -1, dColuna: 1 },
            { dLinha: 1, dColuna: -1 }, { dLinha: 1, dColuna: 1 }
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