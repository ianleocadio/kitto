// -> 0  = inativa || 1 = neutra || 2 = ascendencia || 3 = decadencia 

tempoMax = 4;
tempo = 1
estado = 0;
estadoAnterior = 0;
producao = 0;
streak = 1;

estados = {
    0 : "inativo",
    1 : "estavel",
    2 : "ascendendo",
    3 : "caindo",
}

function alternarEstado(){
    var r2 = Util.Aleatorio.int(0, 105);

    if (producao == 0){
        estado = (Util.Aleatorio.int(1, 2) == 1)? 2 : 3;
    }else if (r2 > 100 || tempoMax == 0){
        estado = 1;
    }else if (producao > 0){
        estado = (r2 > (producao * 100/60) + (3 * streak)) ? 2 : 3;
    } else {
        estado = (r2  > (-producao * 5) + (4 * streak))? 3 : 2;
    }

    if (estado != estadoAnterior){
        estadoAnterior = estado;
        tempoMax = 4;
        streak = 1;
    } else {
        tempoMax --;
        streak ++;
    }

    tempo = Util.Aleatorio.int(1, tempoMax);
}

function ascender(){
    producao += Util.Aleatorio.int(1, 4)
}

function cair(){
    producao += Util.Aleatorio.int(-1, -3)
}

function variar(){
    if (estado == 1) {console.log("Estável")}
    else if(estado == 2){ascender()}
    else if(estado == 3){cair()}
    tempo--

    if (tempo == 0){
        alternarEstado()
    }  

    console.log("tempoMax = " + tempoMax);
    console.log("tempo = " + tempo);
    console.log("estado = " + estados[estado]);
    console.log("streak = " + streak);
    console.log("estadoAnterior = " + estados[estadoAnterior]);
    console.log("producao = " + producao);
    console.log("");

}
    