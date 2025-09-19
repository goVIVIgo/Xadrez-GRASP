import { Tabuleiro } from './classes/Tabuleiro.js';


window.addEventListener('DOMContentLoaded', () => {
  
  console.log("OI HTML OI JAVASCRIPT PORROAS");

  const meuTabuleiro = new Tabuleiro();

  meuTabuleiro.iniciar();



  console.log("FUNCIOINA MERDA", meuTabuleiro);
});