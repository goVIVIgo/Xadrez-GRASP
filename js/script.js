

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

const pontosBrancasElement = document.getElementById('pontos-brancas');
const pontosPretasElement = document.getElementById('pontos-pretas');

const placarContainer = document.querySelector('.placar-container');
const iniciarJogoBtn = document.getElementById('iniciar-jogo-btn');

let pecaSelecionada = null;


function iniciarJogo(modoDeJogo, estiloPartida) {
    console.log(`iniciando jogo: ${modoDeJogo}`);

    jogo = new Jogo(modoDeJogo, estiloPartida);

    menuPrincipal.classList.add('hidden');
    areaJogo.classList.remove('hidden');

    if (estiloPartida === 'tempo') {
        placarContainer.classList.add('escondido');
        timerPretasElement.classList.remove('escondido');
        timerBrancasElement.classList.remove('escondido');

        //callbacks para quando o tempo acabar
        const onPretasTimeUp = () => jogo.declararVitoriaPorTempo('branca');
        const onBrancasTimeUp = () => jogo.declararVitoriaPorTempo('preta');

        timerBrancas = new Timer(10 * 60, timerBrancasElement, onBrancasTimeUp);
        timerPretas = new Timer(10 * 60, timerPretasElement, onPretasTimeUp);
        
        jogo.settimers(timerBrancas, timerPretas);
        alternarTimer('branca');

    } else if (estiloPartida === 'pontos') {
        placarContainer.classList.remove('escondido');
        timerPretasElement.classList.add('escondido');
        timerBrancasElement.classList.add('escondido');
        atualizarPontuacao();
    }

    renderizarTabuleiro();
    gerarCoordenadas();
    atualizarHistorico();
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

            if (jogo.reiEmXeque && i === jogo.reiEmXeque.linha && j === jogo.reiEmXeque.coluna) {
                quadrado.classList.add('em-xeque');
            }

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

    const estadoDoJogo = estado.estado;
    let statusTexto = estadoDoJogo.replace(/_/g, ' ').toUpperCase();

    if (estadoDoJogo === 'vitoria_brancas_tempo') {
        statusTexto = "BRANCAS VENCERAM POR TEMPO BB AVISAH!";
    } else if (estadoDoJogo === 'vitoria_pretas_tempo') {
        statusTexto = "PRETAS VENCERAM POR TEMPO AVISAH!";
    }

    if (estadoDoJogo === 'em_xeque') {
        statusTexto = "XEQUE!";
    } else if (estadoDoJogo.includes('xeque_mate')) {
        const vencedor = estadoDoJogo.includes('brancas') ? 'BRANCAS' : 'PRETAS';
        statusTexto = `${vencedor} VENCERAM!`.toUpperCase();
    }
    statusJogadorElement.innerText = `Vez das: ${estado.jogadorAtual === 'branca' ? 'Brancas' : 'Pretas'}`;
    statusJogoElement.innerText = statusTexto;
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
            atualizarPontuacao();
            alternarTimer(jogo.getEstadoDoJogo().jogadorAtual);
            terminarTimer(jogo.getEstadoDoJogo().estado);

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
     if (estado.includes('vitoria')) {
        if (timerBrancas) timerBrancas.parar();
        if (timerPretas) timerPretas.parar();
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

iniciarJogoBtn.addEventListener('click', () => {
    const tipoOponente = document.getElementById('tipo-oponente').value;
    const estiloPartida = document.getElementById('estilo-partida').value;
    iniciarJogo(tipoOponente, estiloPartida);
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

function atualizarPontuacao() {
    if (!jogo) return;
    const pontos = jogo.getPontos();

    pontosBrancasElement.textContent = pontos.brancas;
    pontosPretasElement.textContent = pontos.pretas;
}

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
    atualizarPontuacao();
    alternarTimer(jogo.getEstadoDoJogo().jogadorAtual);
}, 0);

//Low Coupling: reduzir as dependências entre as classes.
//script.js interage com as classes Jogo, Tabuleiro e IASilly e faz uma boa conexão com o html, permitindo facilidade de trocar ed interface caso a gente queira.

//Controller: Define qual objeto deve receber e coordenar as requisições de eventos do sistema ou da interface do usuário. Geralmente, ele delega o trabalho para outras classes (os especialistas).
//script.js atua como o controlador principal, gerenciando a interação do usuário, atualizando a interface e coordenando as ações entre as classes Jogo, Tabuleiro e IASilly.