export class Quadrado{
   constructor(Tabuleiro, coord) {
       this.peca = null;
       this.tabuleiro = Tabuleiro;
       this.self;
       this.refem = null;
       this.coord = coord;
       console.log(coord)
   }
   
   getcoord(){
    return this.coord;
   }

   setPeca(peca) {
       this.peca = peca;
       if(peca != null){
        peca.setQuad(this.self);
        this.tabuleiro.incluir(peca);

        if(this.refem != null){
            this.tabuleiro.moverPeca({linha:this.refem[0][0],coluna:this.refem[0][1]},{linha:this.refem[1][0],coluna:this.refem[1][1]})
        }
       }
   }

   getTab(){
    return this.tabuleiro
   }

   setrefem(arr){
    this.refem = arr
   }

   getPeca() {
       return this.peca;
   }

   setself(self){
    this.self = self
   }

}