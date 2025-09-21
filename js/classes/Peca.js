export class Peca {
    constructor(cor) {
        if (this.constructor === Peca) {
            throw new Error("A classe 'Peca' é abstrata e não pode ser instanciada diretamente.");
        }
        console.log(cor)
        this.cor = cor;
    }

    get tipo() {
        return this.constructor.name.toLowerCase();
    }

    get valor() {
        // oiii monique oiiii nycolle eh com vcs bjo
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        throw new Error(`O método 'getMovimentosValidos' não foi implementado para a classe '${this.constructor.name}'.`);
    }
}