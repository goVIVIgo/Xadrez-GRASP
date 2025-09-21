const tempoH = document.querySelector(".timer1")
const tempoH2 = document.querySelector(".timer2")

let tempoRestante = 0
let tempo = null;

function inicializacaoTempo(){
    tempoRestante = 10*60
    tempo = null
}

function atualizacaoTempoDisplay(){
    const minutos = Math.floor(tempoRestante / 60).toString().padStart(2, "0");
    const segundos = (tempoRestante %60).toString().padStart(2, "0");
    tempoH.innerText = `${minutos}:${segundos}`
    tempoH2.innerText = `${minutos}:${segundos}`
}

function atualizacaoTempo(){
    if (tempoRestante > 0){
        tempoRestante--
        atualizacaoTempoDisplay()
    }
}

function iniciar(){
    tempo = setInterval(atualizacaoTempo, 1000)
}

inicializacaoTempo()
iniciar()
