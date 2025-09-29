

import { IAMae } from './IAMae.js';

export class IASilly extends IAMae {
    escolherMovimento(jogo) {
        const tabuleiro = jogo.getTabuleiroObjeto();
        const todosOsMovimentosLegais = this._gerarMovimentosLegais(jogo);

        if (todosOsMovimentosLegais.length === 0) {
            return null;
        }

        const capturasDeValor = todosOsMovimentosLegais
            .map(movimento => {
                const pecaAlvo = tabuleiro.getPeca(movimento.posFinal.linha, movimento.posFinal.coluna);

                if (pecaAlvo && pecaAlvo.valor >= 3) {
                    return { movimento: movimento, pontuacao: pecaAlvo.valor };
                }
                return null;
            })
            .filter(item => item !== null);

        if (capturasDeValor.length > 0) {

            const maiorPontuacao = Math.max(...capturasDeValor.map(item => item.pontuacao));

            const melhoresCapturas = capturasDeValor
                .filter(item => item.pontuacao === maiorPontuacao)
                .map(item => item.movimento);

            const indiceAleatorio = Math.floor(Math.random() * melhoresCapturas.length);
            console.log(`IA Silly nao esta sendo burra e sabe que pode comer o/a ${maiorPontuacao}`);
            return melhoresCapturas[indiceAleatorio];
        }

        console.log("IA Silly continua sendo burra");
        const indiceAleatorio = Math.floor(Math.random() * todosOsMovimentosLegais.length);
        return todosOsMovimentosLegais[indiceAleatorio];

    }
}

////Polymorphism: um comportamento varia de acordo com o tipo de um objeto, a responsabilidade por esse comportamento deve ser atribuída aos tipos que o possuem, usando operações polimórficas.
//No caso da IA, a classe IASilly utiliza o método getMovimentosValidos de diferentes peças (como Bispo, Cavalo, etc.) para obter os movimentos válidos de cada peça, independentemente do tipo específico da peça.

//Pure Fabrication: criar uma classe que não representa um conceito do domínio, mas é necessária para suportar a arquitetura do sistema.
//A classe IASilly é uma criação artificial que encapsula a lógica da IA do jogo, separando essa responsabilidade das classes que representam as peças ou o tabuleiro.