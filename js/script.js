

import { Jogo } from './classes/Jogo.js';


const jogo = new Jogo();
const tabuleiroElement = document.getElementById('tabuleiro');
const statusJogadorElement = document.getElementById('status-jogador');
const statusJogoElement = document.getElementById('status-jogo');


let pecaSelecionada = null;



function renderizarTabuleiro() {
    tabuleiroElement.innerHTML = '';
    const estado = jogo.getEstadoDoJogo();

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const quadrado = document.createElement('div');
            quadrado.classList.add('quadrado', (i + j) % 2 === 0 ? 'branco' : 'preto');
            quadrado.dataset.linha = i;
            quadrado.dataset.coluna = j;


            const peca = estado.matriz[i][j];
            if (peca) {
                const imgElement = document.createElement('img');
                imgElement.classList.add('peca-img');
                const corSuffix = peca.cor === 'branca' ? 'b' : 'p';

                const tipoPeca = peca.tipo;


                const caminhoDaImagem = `assets/${tipoPeca}${corSuffix}.png.webp`;
                imgElement.src = caminhoDaImagem;
                imgElement.alt = `${tipoPeca} ${peca.cor}`;

                quadrado.appendChild(imgElement);


                imgElement.onerror = () => {
                    console.error(`NAO PRESTOU A MErda imagem em "${caminhoDaImagem}". VERFIIAR CAMINHO`);
                };
            }

            tabuleiroElement.appendChild(quadrado);
        }
    }


    statusJogadorElement.innerText = `Vez das: ${estado.jogadorAtual === 'branca' ? 'Brancas' : 'Pretas'}`;
    statusJogoElement.innerText = estado.estado.replace('_', ' ').toUpperCase();
}

function aoClicarNoQuadrado(event) {
    const quadradoClicado = event.currentTarget;
    const linha = parseInt(quadradoClicado.dataset.linha);
    const coluna = parseInt(quadradoClicado.dataset.coluna);

    if (pecaSelecionada) {
        jogo.tentarMoverPeca(pecaSelecionada.pos, { linha, coluna });
        pecaSelecionada = null;
        renderizarTabuleiro();
    } else {

        const peca = jogo.getTabuleiroObjeto().getPeca(linha, coluna);

        if (peca && peca.cor === jogo.getEstadoDoJogo().jogadorAtual) {
            pecaSelecionada = { peca, pos: { linha, coluna } };

            renderizarTabuleiro();
            quadradoClicado.classList.add('selecionado');
            destacarMovimentosValidos();
        }
    }
}


function destacarMovimentosValidos() {
    if (!pecaSelecionada) return;

    const movimentos = pecaSelecionada.peca.getMovimentosValidos(pecaSelecionada.pos, jogo.getTabuleiroObjeto());
    movimentos.forEach(mov => {
        const q = tabuleiroElement.querySelector(`[data-linha='${mov.linha}'][data-coluna='${mov.coluna}']`);
        if (q) q.classList.add('movimento-valido');
    });
}


tabuleiroElement.addEventListener('click', (event) => {

    const quadrado = event.target.closest('.quadrado');
    if (quadrado) {
        aoClicarNoQuadrado({ currentTarget: quadrado });
    }
});


renderizarTabuleiro();