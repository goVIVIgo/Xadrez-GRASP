

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

////Polymorphism: um comportamento varia de acordo com o tipo de um objeto, a responsabilidade por esse comportamento deve ser atribuída aos tipos que o possuem, usando operações polimórficas.
//No caso da IA, a classe IASilly utiliza o método getMovimentosValidos de diferentes peças (como Bispo, Cavalo, etc.) para obter os movimentos válidos de cada peça, independentemente do tipo específico da peça.

//Pure Fabrication: criar uma classe que não representa um conceito do domínio, mas é necessária para suportar a arquitetura do sistema.
//A classe IASilly é uma criação artificial que encapsula a lógica da IA do jogo, separando essa responsabilidade das classes que representam as peças ou o tabuleiro.