

import { Jogo } from './classes/Jogo.js';
import { Timer } from './classes/Timer.js';

let jogo = null;
const tabuleiroElement = document.getElementById('tabuleiro');
const statusJogadorElement = document.getElementById('status-jogador');
const statusJogoElement = document.getElementById('status-jogo');
let timerPretas = null;
let timerBrancas = null;

const timerPretasElement = document.querySelector('.timer1');
const timerBrancasElement= document.querySelector('.timer2');

const menuPrincipal = document.getElementById('menu-principal');
const areaJogo = document.getElementById('area-jogo');
const botoesModo = document.querySelectorAll('[data-mode]');

const menuPromocao = document.getElementById('menu-promocao');
const opcoesPromocao = document.querySelectorAll('.opcoes-promocao button');

let pecaSelecionada = null;


function iniciarJogo(modoDeJogo) {
    console.log(`Iniciando jogo no modo: ${modoDeJogo}`);

    jogo = new Jogo(modoDeJogo);

    menuPrincipal.classList.add('hidden');
    areaJogo.classList.remove('hidden');

    timerBrancas = new Timer(10 * 60, timerBrancasElement);
    timerPretas = new Timer(10 * 60, timerPretasElement);

    jogo.settimers(timerBrancas, timerPretas);

    renderizarTabuleiro();
    gerarCoordenadas();
    atualizarHistorico();
    alternarTimer('branca');
}



function renderizarTabuleiro() {
    if (!jogo) return;
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

function vezTurnoIA() {
    const estadoAtual = jogo.getEstadoDoJogo();

    if (jogo.modoDeJogo === 'pvia' && estadoAtual.jogadorAtual === 'preta' && estadoAtual.estado === 'em_andamento') {

        const tempoMinimoDePensamento = 1500; // 1.5 segundos
        const tempoMaximoDePensamento = 4000; // 5 segundos

        const tempoDePensamento = Math.floor(Math.random() * (tempoMaximoDePensamento - tempoMinimoDePensamento + 1)) + tempoMinimoDePensamento;

        console.log(`IA vai pensar por ${tempoDePensamento / 1000} segundos...`);

        tabuleiroElement.classList.add('aguardando-ia');
        setTimeout(() => {
            jogo.acionarJogadaIA();
            tabuleiroElement.classList.remove('aguardando-ia');
        }, tempoDePensamento);
    }
}

function aoClicarNoQuadrado(event) {
    if (!jogo || jogo.isAguardandoIA()) return;
    const quadradoClicado = event.currentTarget;
    const linha = parseInt(quadradoClicado.dataset.linha);
    const coluna = parseInt(quadradoClicado.dataset.coluna);

    if (pecaSelecionada) {
        const movimentoBemSucedido = jogo.tentarMoverPeca(pecaSelecionada.pos, { linha, coluna });
        pecaSelecionada = null;

        if (movimentoBemSucedido) {
            renderizarTabuleiro(); 
            if (jogo.promocaoPendente) {
                menuPromocao.classList.remove('hidden');
            } else {
                vezTurnoIA();
            }

            atualizarHistorico();
            alternarTimer(jogo.getEstadoDoJogo().jogadorAtual);
            terminarTimer(jogo.getEstadoDoJogo().estado);
            console.log(jogo.getPontuacao());

        } else {
            renderizarTabuleiro();
        }
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
    if (!jogo || !historicoTabela) return;
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



    const movimentos = pecaSelecionada.peca.getMovimentosValidos(pecaSelecionada.pos, jogo.getTabuleiroObjeto(), jogo);
    movimentos.forEach(mov => {
        const q = tabuleiroElement.querySelector(`[data-linha='${mov.linha}'][data-coluna='${mov.coluna}']`);
        if (q) q.classList.add('movimento-valido');
    });
}



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
    if (!timerBrancas || !timerPretas) return;


    if (jogadorAtual === "branca") {
        timerPretas.parar();
        timerBrancas.iniciar();
    } else {
        timerBrancas.parar();
        timerPretas.iniciar();
    }
}

function gerarCoordenadas() {
    const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const numeros = ['8', '7', '6', '5', '4', '3', '2', '1'];


    const baixoContainer = document.getElementById('coords-letras-baixo');
    const esqContainer = document.getElementById('coords-numeros-esq');


    //garante que nao duplique as letras e numeros

    baixoContainer.innerHTML = '';
    esqContainer.innerHTML = '';


    //adiciona as letras e numeros
    letras.forEach(letra => {
        const spanBaixo = document.createElement('span');
        spanBaixo.textContent = letra;
        baixoContainer.appendChild(spanBaixo);

    });
    
    numeros.forEach(num => {
        const spanEsq = document.createElement('span');
        spanEsq.textContent = num;
        esqContainer.appendChild(spanEsq);

    });
}

botoesModo.forEach(botao => {
    botao.addEventListener('click', () => {
        const modo = botao.dataset.mode;
        iniciarJogo(modo);
    });
});


opcoesPromocao.forEach(botao => {
    botao.addEventListener('click', () => {
        const tipoPeca = botao.dataset.peca;
        jogo.executarPromocao(tipoPeca);

        menuPromocao.classList.add('hidden');

        renderizarTabuleiro();
        vezTurnoIA();
    });
});

tabuleiroElement.addEventListener('click', (event) => {
    const quadrado = event.target.closest('.quadrado');
    if (quadrado) {
        aoClicarNoQuadrado({ currentTarget: quadrado });
    }
})

window.addEventListener('estadoAtualizadoPelaIA', () => {
    if (!jogo) return;
    renderizarTabuleiro();
    atualizarHistorico();
    alternarTimer(jogo.getEstadoDoJogo().jogadorAtual);
}, 0);
