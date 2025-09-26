

import { Jogo } from './classes/Jogo.js';
import { Timer } from './classes/Timer.js';

const jogo = new Jogo();
const tabuleiroElement = document.getElementById('tabuleiro');
const statusJogadorElement = document.getElementById('status-jogador');
const statusJogoElement = document.getElementById('status-jogo');
const timerPretas = new Timer(10 * 60, document.querySelector(".timer1"));
const timerBrancas = new Timer(10 * 60, document.querySelector(".timer2"));


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
        if (jogo.tentarMoverPeca(pecaSelecionada.pos, { linha, coluna })) {
            atualizarHistorico(); // atualizar histórico CADA movimento
            alternarTimer(jogo.getEstadoDoJogo().jogadorAtual); 
            terminarTimer(jogo.getEstadoDoJogo().estado);
            console.log(jogo.getPontuacao())
        }
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

const historicoTabela = document.getElementById('historico-tabela').querySelector('tbody'); //coloca o histórico a mostra no front end

function atualizarHistorico() {
    historicoTabela.innerHTML = ''; // limpa a tabela
    const historico = jogo.getEstadoDoJogo().historico;
    for (let i = 0; i < historico.length; i += 2) {
        const movimentoBranco = historico[i] || '';
        const movimentoPreto = historico[i + 1] || '';

        const tr = document.createElement('tr'); // cria a tabela
        const tdBranco = document.createElement('td'); //movimento brancas
        const tdPreto = document.createElement('td'); // movimento pretas

        // adiciona o texto de movimento na tabela
        tdBranco.textContent = movimentoBranco;
        tdPreto.textContent = movimentoPreto;

        // cores diferentes para cada jogador
        tdBranco.style.color = 'black';
        tdBranco.style.backgroundColor = 'white';
        tdPreto.style.color = 'white';
        tdPreto.style.backgroundColor = 'black';

        // adiciona na tabela no espaço tr eu acho?
        tr.appendChild(tdBranco); 
        tr.appendChild(tdPreto);
        // adiciona cada dado na tabela
        historicoTabela.appendChild(tr);
    }

}

function destacarMovimentosValidos() {
    if (!pecaSelecionada) return;

    const movimentos = pecaSelecionada.peca.getMovimentosLegais(pecaSelecionada.pos, jogo.getTabuleiroObjeto());
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

function terminarTimer(estado){
    if(estado === 'vitoria_pretas'){
        timerBrancas.parar();
        timerPretas.parar();
    } else if (estado ==='vitoria_brancas'){
        timerBrancas.parar();
        timerPretas.parar();
    }
}

function alternarTimer(jogadorAtual) {
    if (jogadorAtual === "branca") {
        timerPretas.parar();
        timerBrancas.iniciar();
    } else {
        timerBrancas.parar();
        timerPretas.iniciar();
    }
}


jogo.settimers(timerBrancas,timerPretas)
timerBrancas.atualizarDisplay();
timerPretas.atualizarDisplay();
renderizarTabuleiro();