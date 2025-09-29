export class IAMae {
    _gerarMovimentosLegais(jogo) {
    const cor = jogo.getEstadoDoJogo().jogadorAtual;
    const movimentosPseudoLegais = this._gerarTodosOsMovimentosPossiveis(jogo, cor);
    const movimentosLegais = [];
    const tabuleiro = jogo.getTabuleiroObjeto();

    console.log(`Testando ${movimentosPseudoLegais.length} movimentos para a cor ${cor}`);

    for (const movimento of movimentosPseudoLegais) {
        const pecaMovida = tabuleiro.getPeca(movimento.posInicial.linha, movimento.posInicial.coluna);

        const pecaCapturada = tabuleiro.getPeca(movimento.posFinal.linha, movimento.posFinal.coluna);
        const virgemOriginal = pecaMovida.virgem;
        if (pecaCapturada) tabuleiro.removerPecaDaLista(pecaCapturada);
        tabuleiro.matriz[movimento.posFinal.linha][movimento.posFinal.coluna].setPeca(pecaMovida);
        tabuleiro.matriz[movimento.posInicial.linha][movimento.posInicial.coluna].setPeca(null);
        pecaMovida.virgem = false;

        const rei = tabuleiro.getRei(cor);
        const posRei = tabuleiro.dicionarizarposicao(rei.getQuad());
        const corOponente = cor === 'branca' ? 'preta' : 'branca';
        const atacantes = jogo.quemEstaAtacando(posRei, corOponente);
        const reiEstaSeguro = atacantes.length === 0;
        
        const logStyle = reiEstaSeguro ? "color: limegreen;" : "color: red;";
        console.log(`Mover ${pecaMovida.tipo} de [${movimento.posInicial.linha},${movimento.posInicial.coluna}] para [${movimento.posFinal.linha},${movimento.posFinal.coluna}]. O rei ficou seguro? ${reiEstaSeguro}`, logStyle);

        if (!reiEstaSeguro) {
            console.log(`O rei em [${posRei.linha},${posRei.coluna}] ainda está sendo atacado por:`, atacantes.map(p => `${p.peca.tipo} em [${p.pos.linha},${p.pos.coluna}]`));
        }

        tabuleiro.matriz[movimento.posInicial.linha][movimento.posInicial.coluna].setPeca(pecaMovida);
        tabuleiro.matriz[movimento.posFinal.linha][movimento.posFinal.coluna].setPeca(pecaCapturada);
        pecaMovida.virgem = virgemOriginal;
        if (pecaCapturada) tabuleiro.incluir(pecaCapturada);

        if (reiEstaSeguro) {
            movimentosLegais.push(movimento);
        }
    }
    console.log(` ${movimentosLegais.length} movimentos seguros encontrados`);
    return movimentosLegais;
}

    _gerarTodosOsMovimentosPossiveis(jogo, cor) {
        const movimentos = [];
        const tabuleiro = jogo.getTabuleiroObjeto();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const peca = tabuleiro.getPeca(i, j);
                if (peca && peca.cor === cor) {
                    const posInicial = { linha: i, coluna: j };
                    const movimentosDaPeca = peca.getMovimentosValidos(posInicial, tabuleiro, jogo);
                    for (const posFinal of movimentosDaPeca) {
                        movimentos.push({ posInicial, posFinal });
                    }
                }
            }
        }
        return movimentos;
    }
}