import { Torre } from './torre.js';
import { Cavalo } from './cavalo.js';
import { Bispo } from './bispo.js';
import { Rei } from './rei.js';
import { Rainha } from './Rainha.js';



export class Tabuleiro {
    constructor() {
        this.layout = [new Torre(), new Cavalo(), new Bispo(), new Rei(), new Rainha(), new Bispo(), new Cavalo(), new Torre()];
        this.matriz = [];
    }

    iniciar() {
        for (let linha = 0; linha < 8; linha++) {
            this.matriz[linha] = [];
            for (let coluna = 0; coluna < 8; coluna++) {
                console.log("oiii nn tenho quadrado");
            }
        }
        for (let i = 0; i < 8; i++) {
            this.matriz[0][i] = this.layout[i];
        }
        
        console.log("fucnqowiidqiqod mwerrdad ");
    }
}
