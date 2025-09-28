

export class IASilly{

    escolherMovimento(jogo) {
        console.log("oiiii oiiii testandoo oiiii");

        const corIA = jogo.getEstadoDoJogo().jogadorAtual;

        const todosOsMovimentos = this.#gerarTodosOsMovimentosPossiveis(jogo, corIA);

        if (todosOsMovimentos.length === 0) {
            return null;
        }

        const indiceAleatorio = Math.floor(Math.random() * todosOsMovimentos.length);
        const movimentoEscolhido = todosOsMovimentos[indiceAleatorio];

        console.log("movimento aplicado:", movimentoEscolhido);
        return movimentoEscolhido;
    }

    #gerarTodosOsMovimentosPossiveis(jogo, cor) {
        const movimentos = [];
        const tabuleiro = jogo.getTabuleiroObjeto();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const peca = tabuleiro.getPeca(i, j);

                if (peca && peca.cor === cor) {
                    const posInicial = { linha: i, coluna: j };
                    const movimentosDaPeca = peca.getMovimentosValidos(posInicial, tabuleiro, jogo);

                    for (const posFinal of movimentosDaPeca) {
                        movimentos.push({ posInicial, posFinal });
                    }
                }
            }
        }
        return movimentos;
    }
}