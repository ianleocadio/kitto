// Camada de jogo
// Responsável por toda a lógica do jogo
var Jogo = {};

Jogo.dols = 0;
Jogo.dps = 0;
Jogo.bolsaAtiva = -1;

/*
-1 = Não foi liberado ainda || False = Não possui contrato || True = Possui um contrato

*/

Jogo.buffs = []

Jogo.gastarDols = function (dols) {
    this.dols -= dols;
    document.getElementById("dolsText").innerHTML = Util.conversor(this.dols);
}

Jogo.somarDols = function (dols) {
    this.dols += dols;
    document.getElementById("dolsText").innerHTML = Util.conversor(this.dols);
}

Jogo.mudarDPS = function (novoDPS) {
    this.dps = novoDPS;
    document.getElementById("dpsText").innerHTML = Util.conversor(this.dps) + " DpS";

    if (!Jogo.bolsaAtiva) {
        Bolsa.recalcularValor();  
    }
}

Jogo.recalcularDPS = function () {
    var novoDPS = 0;
    
    for (item in itens) {
        itens[item].recalcularProducao();
        novoDPS += itens[item].producaoTotal;
    }
  
    for (buff in Jogo.buffs) {
        novoDPS += buffs[buff];
    }

    if (Jogo.bolsaAtiva == true) {
        dpsRepartido = novoDPS * 0.2;
        
        Bolsa.setDPS(dpsRepartido);
        novoDPS -= dpsRepartido;
    }

    this.mudarDPS(novoDPS);
}

Jogo.mudarDPC = function (novoDPC) {
    MainClick.setDPC(novoDPC);
    document.getElementById("dpcText").innerHTML = MainClick.dpc + " DpC" + " (" + Util.arredondar(((MainClick.progressoClickUpgrade / 140) * 100), 1) + "%)";
}

Jogo.getDPS = function () {
    return Jogo.dps;
}

Jogo.addBuff = function (buff) {
    Jogo.buffs.push(buff);
}


Jogo.liberarBolsa = function () {
    Bolsa.init();
}