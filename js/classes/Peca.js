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
        const PONTOS = { 'peao': 1, 'cavalo': 3, 'bispo': 3, 'torre': 5, 'dama': 9, 'rei': 0 };
        return PONTOS[this.tipo] || 0;
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        throw new Error(`O método 'getMovimentosValidos' não foi implementado para a classe '${this.constructor.name}'.`);
    }
}