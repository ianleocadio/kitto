Interface = {};

Interface.atualizarTextoCompra = function(botao, item) {
    botao.innerHTML = "Comprar " + item.nomeTextual + ": " + item.valor + " dols";
}

Interface.atualizarTextoInfo = function(texto, item){
    /*
    if (texto.style.diplay != "inline-block") {
        texto.style.display = "inline-block"
    }
    texto.innerHTML = item.nomeTextual + ": " + item.quantidade + " (" + arredondar(item.producaoTotal, 1) + " DpS)";

    */
}
