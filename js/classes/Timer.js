export class Timer {
    constructor(segundosIniciais, elemento, onTimeUpCallback = () => {}) {
        this.tempoRestante = segundosIniciais;
        this.elemento = elemento;
        this.intervalo = null;
        this.onTimeUp = onTimeUpCallback;
        this.atualizarDisplay();
    }

    formatarTempo() {
        const m = Math.floor(this.tempoRestante / 60).toString().padStart(2, "0");
        const s = (this.tempoRestante % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    atualizarDisplay() {
        this.elemento.innerText = this.formatarTempo();
    }

    contar() {
        if (this.tempoRestante > 0) {
            this.tempoRestante--;
            this.atualizarDisplay();
        }else {
            this.parar();
            this.onTimeUp();
        }
    }

    iniciar() {
        if (this.intervalo) return;
        this.intervalo = setInterval(() => this.contar(), 1000);
    }

    parar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }
}

//High Cohesion: uma classe deve ter uma única responsabilidade ou um conjunto de responsabilidades altamente relacionadas.
//A classe Timer é responsável por gerenciar a contagem regressiva do tempo, incluindo iniciar, parar e atualizar o display do tempo restante. Não tem nenhuma responsabilidade relacionada a regras de xadrez ou renderização de peças.