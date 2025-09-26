export class Quadrado{
   constructor(Tabuleiro, coord) {
       this.peca = null;
       this.tabuleiro = Tabuleiro;
       this.self;
       this.coord = coord;
       console.log(coord)
   }
   
   getcoord(){
    return this.coord; // array com elemento x e y
   }

   setPeca(peca) {
       this.peca = peca;
       if(peca != null){
        peca.setQuad(this.self);
        this.tabuleiro.incluir(peca);

       }
   }

   getTab(){
    return this.tabuleiro
   }

   getPeca() {
       return this.peca;
   }

   setself(self){
    this.self = self
   }

}