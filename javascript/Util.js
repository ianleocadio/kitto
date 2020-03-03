var Util = {};

Util.arredondar = function(numero, casas){
    if (numero % 1 == 0){
        return numero;
    } else {    
        return Number(numero.toFixed(casas));
    }
}
    
Util.array = [" Million", " Billion", " Trillion", " Quadrillion", " Quintillion", " Sextillion", " Septillion", " Octillion", " Nonillion", " Decillion", " Undecillion", " Duodecillion", " Tredecillion", " Quatuordecillion", " Quindecillion", " Sexdecillion", " Septendecillion", " Octodecillion", " Novemdecillion", " Vigintillion", " Unvigintillion", " Duovigintillion", " Tresvigintillion", " Quatuorvigintillion", " Quinquavigintillion", " Sesvigintillion", " Septemvigintillion", " Octovigintillion", " Novemvigintillion", " Trigintillion", " Untrigintillion", " Duotrigintillion", " Trestrigintillion", " Quatuortrigintillion", " Quinquatrigintillion", " Sestrigintillion", " Septentrigintillion", " Octotrigintillion", " Novemtrigintillion", " Quadragintillion", " Unquadragintillion", " Duoquadragintillion", " Tresquadragintillion", " Quatuorquadragintillion", " Quinquaquadragintillion", " Sesquadragintillion", " Septemquadragintillion", " Octoquadragintillion", " Novemquadragintillion", " Quinquagintillion", " Unquinquagintillion", " Duoquinquagintillion", " Tresquinquagintillion", " Quatuorquinquagintillion", " Quinquaquinquagintillion", " Sesquinquagintillion", " Septenquinquagintillion", " Octoquinquagintillion", " Novemquinquagintillion", " Sexagintillion", " Unsexagintillion", " Duosexagintillion", " Tressexagintillion", " Quatuorsexagintillion", " Quinquasexagintillion", " Sexasexagintillion", " Septemsexagintillion", " Octosexagintillion", " Novemsexagintillion", " Septuagintillion", " Unseptuagintillion", " Duoseptuagintillion", " Tresseptuagintillion", " Quatuorseptuagintillion", " Quinquaseptuagintillion", " Sexaseptuagintillion", " Septenseptuagintillion", " Octoseptuagintillion", " Novemseptuagintillion", " Octogintillion", " Unoctogintillion", " Duooctogintillion", " Tresoctogintillion", " Quatuoroctogintillion", " Quinquaoctogintillion", " Sesoctogintillion", " Septemoctogintillion", " Octooctogintillion", " Novemoctogintillion", " Nonagintillion", " Unnonagintillion", " Duononagintillion", " Tresnonagintillion", " Quatuornonagintillion", " Quinquanonagintillion", " Sesnonagintillion", " Septemnonagintillion", " Octononagintillion", " Novemnonagintillion", " Centillion", " Uncentillion"];

Util.conversor = function(numero) {
    if(numero < 999999 && numero > -999999) return numero.toFixed(1);
    let negativo = false;
    if(numero < -999999) {
        negativo = true;
        numero = Math.abs(numero);
    }
    numero = Math.ceil(numero);
    numero = numero.toLocaleString('fullwide', { useGrouping: false });
    
    let tam = String(Math.floor(numero)).length;
    let dividendo = tam % 3 == 0 ? tam - 3 : tam - tam % 3;
    let resto = numero / Math.pow(10, dividendo);
    let pos = Math.ceil(tam / 3) - 3;
    
    return (negativo ? "-" : "") + String(resto).slice(0, 4 + (tam % 3 == 0 ? 3 : tam % 3)) + Util.array[pos];
}


/*Util.conversor = function(numero) {
    numero = numero.toLocaleString('fullwide', { useGrouping: false });
    let tam = String(Math.floor(numero)).length;
    
    if(tam <= 6) return numero;

    let dividendo = tam % 3 == 0 ? tam - 3 : tam - tam % 3;
    let resto = numero / Math.pow(10, dividendo);
    let pos = Math.ceil(tam / 3) - 3;
    
    return String(resto).slice(0, 4 + (tam % 3 == 0 ? 3 : tam % 3)) + Util.array[pos];
}*/

Util.Aleatorio = {}

Util.Aleatorio.int = function(min, max) {
    return Math.floor((Math.random() * (max + 1 - min)) + min);
}
