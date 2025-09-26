export class Peca {
    constructor(cor) {
        if (this.constructor === Peca) {
            throw new Error("A classe 'Peca' é abstrata e não pode ser instanciada diretamente.");
        }
        // console.log(cor)
        this.cor = cor;
        this.quad = null;
        this.virgem = true;
    }

    get tipo() {
        return this.constructor.name.toLowerCase();
    }

    get valor() {
        const valores = {  peao: 1, cavalo: 3, bispo: 3,   torre: 5,    rainha: 9, rei: 0 };

        return valores[this.tipo] 
    }

    getQuad() {
        return this.quad
    }

    setQuad(qua){
        this.quad = qua
    }

    ehvirgem(){
        return this.virgem
    }

    andou(a,b){
        this.virgem = false
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        throw new Error(`O método 'getMovimentosValidos' não foi implementado para a classe '${this.constructor.name}'.`);
    }

    getAmeaca(posicaoAtual, tabuleiro){
        return this.getMovimentosValidos(posicaoAtual, tabuleiro)
    }

    getMovimentosLegais(posicaoAtual, tabuleiro){
        var a = this.getMovimentosValidos(posicaoAtual, tabuleiro)
        var movimentoslegais = []
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            var b = tabuleiro.getQuad(element.linha, element.coluna)
            if(!(b.getPeca() && b.getPeca().tipo == "rei")){
                movimentoslegais.push(element)
            }
        }
        return movimentoslegais
    }
}