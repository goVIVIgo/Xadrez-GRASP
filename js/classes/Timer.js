export class Timer {
    constructor(segundosIniciais, elemento) {
        this.tempoRestante = segundosIniciais;
        this.elemento = elemento;
        this.intervalo = null;
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
        }
    }

    iniciar() {
        this.parar();
        this.intervalo = setInterval(() => this.contar(), 1000);
    }

    parar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

  
    
}