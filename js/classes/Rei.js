import { Peca } from './Peca.js';

export class Rei extends Peca {
    constructor(cor) {
        super(cor);
    }

    get tipo() {
        return 'rei'; 
    }

    getMovimentosValidos(posicaoAtual, tabuleiro) {
        var movimentos = [];
        const { linha, coluna } = posicaoAtual;

        const offsets = [
            { dLinha: -1, dColuna: 0 }, { dLinha: 1, dColuna: 0 },
            { dLinha: 0, dColuna: -1 }, { dLinha: 0, dColuna: 1 },
            { dLinha: -1, dColuna: -1 }, { dLinha: -1, dColuna: 1 },
            { dLinha: 1, dColuna: -1 },  { dLinha: 1, dColuna: 1 }
        ];

        for (const offset of offsets) {
            const novaLinha = linha + offset.dLinha;
            const novaColuna = coluna + offset.dColuna;

            if (tabuleiro.isPosicaoValida(novaLinha, novaColuna)) {
                const pecaAlvo = tabuleiro.getPeca(novaLinha, novaColuna);

                if (!pecaAlvo || pecaAlvo.cor !== this.cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
            }
        }

        var a = this.roque()
        for (let index = 0; index < a.length; index++) {
            const element = a[index];
            var b = coluna-element[1]

            movimentos.push({ linha: linha, coluna:b})
        }
        // tem que mplementar a lógica do Roque (trocar rei com torre) e a validação para impedir que o Rei se mova para uma posição de xeque e se mate.

        var assegurar = []
        for (let index = 0; index < movimentos.length; index++) {
            const element = movimentos[index];
            if(this.quad.getTab().taseguro(this.quad.getTab().getQuad(element.linha,element.coluna),this.quad.getPeca())){
                assegurar.push(element)
            }
        }

        movimentos = assegurar
        console.log(movimentos)

        return movimentos; // movimentos: uma array de dicionarios que dizem a posicao absoluta dos quadrados
    }

    getAmeaca(posicaoAtual, tabuleiro){
        const movimentos = [];
        const { linha, coluna } = posicaoAtual;

        const offsets = [
            { dLinha: -1, dColuna: 0 }, { dLinha: 1, dColuna: 0 },
            { dLinha: 0, dColuna: -1 }, { dLinha: 0, dColuna: 1 },
            { dLinha: -1, dColuna: -1 }, { dLinha: -1, dColuna: 1 },
            { dLinha: 1, dColuna: -1 },  { dLinha: 1, dColuna: 1 }
        ];

        for (const offset of offsets) {
            const novaLinha = linha + offset.dLinha;
            const novaColuna = coluna + offset.dColuna;

            if (tabuleiro.isPosicaoValida(novaLinha, novaColuna)) {
                const pecaAlvo = tabuleiro.getPeca(novaLinha, novaColuna);

                if (!pecaAlvo || pecaAlvo.cor !== this.cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
            }
        }

        return movimentos;
    }

    roque(){
        var torres = []

        if(!this.ehvirgem()){
            return torres
        }

        var todas = this.getQuad().getTab().getTodas()
        for (let index = 0; index < todas.length; index++) {
            const element = todas[index];
            if(element.tipo=="torre" && element.cor == this.cor && element.ehvirgem()){
                torres.push(element)
            }
        }
        var livretorres = []
        for (let index = 0; index < torres.length; index++) {
            const element = torres[index];
            var y = this.getQuad().getcoord()[1]
            if(element.getQuad().getcoord()[0] === 0 && this.talivre([[1,y],[2,y],[3,y]])){
                livretorres.push([[[element.getQuad().getcoord()[0],2],[[element.getQuad().getcoord()[0],0],[element.getQuad().getcoord()[0],3]]],2])
            }
            if(element.getQuad().getcoord()[0] === 7 && this.talivre([[5,y],[6,y]])){
                livretorres.push([[[element.getQuad().getcoord()[0],6],[[element.getQuad().getcoord()[0],7],[element.getQuad().getcoord()[0],5]]],-2])
            }
        }
        return livretorres
    }

    talivre(arrdecoords){
        var tasim = true
        for (let index = 0; index < arrdecoords.length; index++) {
            const element = arrdecoords[index];
            if(!this.getQuad().getTab().talivre(element)){
                tasim = false
                console.log("NAO TA LIVRE A POSICAO "+element)
                break
            }
        }
        return tasim
    }

    andou(posini,posf){
        if(this.virgem){
            if(posf.coluna==2 && (posf.linha==7 || posf.linha==0)){
                this.quad.getTab().moverPeca({linha:posf.linha,coluna:0},{linha:posf.linha,coluna:3})
                this.quad.getTab().pularhistorico()
                console.log("roque longo")
            }else if(posf.coluna==6 && (posf.linha==7 || posf.linha==0)){
                this.quad.getTab().moverPeca({linha:posf.linha,coluna:7},{linha:posf.linha,coluna:5})
                this.quad.getTab().pularhistorico()
                console.log("roque curto")
            }
        }
        this.virgem = false
    }
}