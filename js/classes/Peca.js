export class Peca {
    constructor(cor) {
        if (this.constructor === Peca) {
            throw new Error("A classe 'Peca' é abstrata e não pode ser instanciada diretamente.");
        }
        // console.log(cor)
        this.cor = cor;
        this.quad = null;
        this.virgem = true;
        this.memoryquad;
        this.fainted = false
        this.self
    }

    setself(self){
        this.self = self
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

    ameacar(tab){
        var a = this.getAmeaca(tab.dicionarizarposicao(this.quad),tab)
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            var q = tab.getQuad(element.linha, element.coluna)
            if(q.getPeca() != null && q.getPeca().tipo == "rei"){
                if(tab.checkformate(q.getPeca())){console.log("checkmate real")}else{console.log("alarme falso")}
            }
        }
    }

    storecoord(){
        this.memoryquad = this.quad
    }

    protege(rei,oponentes,tab){
        console.log("tentando proteger com "+this.tipo)
        var a = this.getMovimentosLegais(tab.dicionarizarposicao(this.quad),tab)
        for (let index = 0; index < a.length; index++) { // checando todos os movimentos legais
            const element = a[index];
            var q = tab.getQuad(element.linha, element.coluna)
            console.log("para "+element.linha,element.coluna)
            q.catch(this.quad.getPeca(),false)

            var ameaca = false
            for (let j = 0; j < oponentes.length; j++) {
                const elem = oponentes[j];
                if(this.estaameacando(elem,rei)){
                    ameaca = true
                    break
            }}
            tab.tryagain()
            if(!ameaca){
                return true}
        }
        return false
    }

    estaameacando(inim, rei){ // ve se esta dentro dos quadrados de getAmeaca e se nao esta desmaiado
        if(inim.fainted){return false}
        var tabuleiro=this.quad.getTab()
        var arr = inim.getAmeaca(tabuleiro.dicionarizarposicao(inim.getQuad()),tabuleiro)
        const tab = this.quad.getTab()
        for (let index = 0; index < arr.length; index++) {
            var element = arr[index];
            element = tab.getQuad(element.linha, element.coluna)
            if(element.getPeca!= null && element.getPeca()==rei){
                return true}
        }
        return false
    }

    faint(x){
        this.fainted=x
    }

    tryagain(){
        this.memoryquad.catch(this.self,true)
        this.faint(false)
    }
}