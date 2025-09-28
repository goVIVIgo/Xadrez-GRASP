import { Peca } from './peca.js';

export class Peao extends Peca {
    constructor(cor) {
        super(cor);
    }

    getMovimentosValidos(posicaoAtual, tabuleiro, jogo) {
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

        if (jogo) {
            const alvoEnPassant = jogo.getAlvoEnPassant();
            console.log("oiii en passant");
            console.log("MORRE CU", alvoEnPassant);
            console.log("PPOSI PEAO", posicaoAtual);
            if (alvoEnPassant) {
                //checa en passant
                const linhaCorreta = (this.cor === 'branca' && posicaoAtual.linha === 3) || (this.cor === 'preta' && posicaoAtual.linha === 4);
                console.log("LINHA CERTA", linhaCorreta);
                //chdca coluna
                const colunaCorreta = Math.abs(posicaoAtual.coluna - alvoEnPassant.coluna) === 1;
                console.log("COLUNA CERTA", colunaCorreta);
                //checa a casa de destino
                const casaDestinoCorreta = (alvoEnPassant.linha === posicaoAtual.linha + direcao);
                console.log("ALVOOOOOOOOOOOOOOOO", casaDestinoCorreta);
            console.log(`(ALVO = ${alvoEnPassant.linha}, VAI PARA = ${linha + direcao})`);

                if (linhaCorreta && colunaCorreta && casaDestinoCorreta) {
                     console.log("EBAAAAAAA");
                    movimentos.push({ 
                        linha: alvoEnPassant.linha, 
                        coluna: alvoEnPassant.coluna, 
                        enPassant: true //possibilita en passant
                    });
                } else{
                    console.log("nada de eba.");
                }
            }
        }
        
        //tem que fazer ainda o "en passant"(aquele negocio que o pedro fez cmg na casa da monique do peao capturar outro peao se avançar uma casa dele) e promoção do peão na ultima casa.

        return movimentos;
    }

    getAmeaca(posicaoAtual, tabuleiro){
        const movimentos = [];
        const { linha, coluna } = posicaoAtual;

        const direcao = this.cor === 'branca' ? -1 : 1;

        const umaCasaFrente = linha + direcao;

        const diagonais = [coluna - 1, coluna + 1];
        for (const diagColuna of diagonais) {
            if (tabuleiro.isPosicaoValida(umaCasaFrente, diagColuna)) {
                const pecaAlvo = tabuleiro.getPeca(umaCasaFrente, diagColuna);

                movimentos.push({ linha: umaCasaFrente, coluna: diagColuna });
            }
        }

        return movimentos;
    }

}

//Information Expert: a responsabilidade por uma ação deve ser atribuída à classe que tem a maior parte da informação necessária para realizá-la.
//No caso dos movimentos do peao, a classe Bispo tem toda a informação necessária para calcular seus movimentos válidos com base na posição atual e no estado do tabuleiro.