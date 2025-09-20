import { Peca } from './peca.js';

export class Peao extends Peca {
    constructor(cor) {
        super(cor);
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        const movimentos = [];
        const { linha, coluna } = posicaoAtual;

        const direcao = this.cor === 'branca' ? -1 : 1; // faz sentido pq peao branco sobe e preto desce, ne?

        const umaCasaFrente = linha + direcao;
        if (tabuleiro.isPosicaoValida(umaCasaFrente, coluna) && !tabuleiro.getPeca(umaCasaFrente, coluna)) {
            movimentos.push({ linha: umaCasaFrente, coluna: coluna });

            const estaNaPosicaoInicial = (this.cor === 'branca' && linha === 6) || (this.cor === 'preta' && linha === 1);
            const duasCasasFrente = linha + (2 * direcao);
            if (estaNaPosicaoInicial && !tabuleiro.getPeca(duasCasasFrente, coluna)) {
                movimentos.push({ linha: duasCasasFrente, coluna: coluna });
            }
        }

        const diagonais = [coluna - 1, coluna + 1];
        for (const diagColuna of diagonais) {
            if (tabuleiro.isPosicaoValida(umaCasaFrente, diagColuna)) {
                const pecaAlvo = tabuleiro.getPeca(umaCasaFrente, diagColuna);

                if (pecaAlvo && pecaAlvo.cor !== this.cor) {
                    movimentos.push({ linha: umaCasaFrente, coluna: diagColuna });
                }
            }
        }
        
        //tem que fazer ainda o "en passant"(aquele negocio que o pedro fez cmg na casa da monique do peao capturar outro peao se avançar uma casa dele) e promoção do peão na ultima casa.

        return movimentos;
    }
}