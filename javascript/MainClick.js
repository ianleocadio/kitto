MainClick = {}// Camada do click principal, responsável pelos cálculos e obtenção de valores. QUASE TUDO SERÁ RETORNADO


MainClick.dpc = 1;
MainClick.quantidadeDeClicks = 0;
MainClick.progressoPorClick = 1;
MainClick.progressoClickBonus = 0;
MainClick.clicksParaBonus = 10;
MainClick.clicksParaUpgrade = 140;
MainClick.progressoClickUpgrade = 0;
MainClick.multiplicadorClickBonus = 4;
MainClick.buffs = [];
MainClick.buffsTemporarios = [];
    
MainClick.clicar = function(){
    Jogo.somarDols(this.dpc);
    this.contarClick();
}

MainClick.getDPC = function() {
    return MainClick.dpc;
}

MainClick.somarDPC = function(incremento) {
    this.dpc += Util.arredondar(incremento, 1);
    document.getElementById("dpcText").innerHTML = Util.arredondar(this.dpc, 1) + " DpC" + " (" + Util.arredondar((this.progressoClickUpgrade / this.clicksParaUpgrade * 100) , 1) + "%)"
}

MainClick.mudarDPC = function(novoDPC){
    this.dpc = novoDPC;
    document.getElementById("dpcText").innerHTML = Util.arredondar(this.dpc, 1) + " DpC" + " (" + Util.arredondar((this.progressoClickUpgrade / this.clicksParaUpgrade * 100) , 1) + "%)"
}

MainClick.getProgressoClick = function() {
    return this.progressoClickBonus;
}


MainClick.clickBonus = function() {
    if (this.progressoClickBonus == this.clicksParaBonus) {
            Jogo.somarDols(this.multiplicadorClickBonus * this.dpc);
            this.progressoClickBonus = 0;
            this.progressoClickUpgrade += (this.CartelEvent.ativo)? 0 : 3 * this.progressoPorClick;
    }
}

MainClick.clickUpgrade = function () {
    /* 
    A Função que dá um upgrade passivo no click
    */
    if (this.progressoClickUpgrade >= this.clicksParaUpgrade){
        // Aumenta em 20% o poder do click
        MainClick.somarDPC(MainClick.dpc * 0.2);
		this.progressoClickUpgrade = 0;
	}
}

MainClick.contarClick = function() {
	this.quantidadeDeClicks++;

	if (this.quantidadeDeClicks in clickUpgrades){
		gerarUpgradeTag(clickUpgrades[this.quantidadeDeClicks]);
    }
    
    this.progressoClickBonus++; 
	this.progressoClickUpgrade += (MainClick.CartelEvent.ativo)? 0 : this.progressoPorClick;

	this.clickBonus();
	this.clickUpgrade();

	document.getElementById("dpcText").innerHTML = Util.arredondar(this.dpc, 1) + " DpC" + " (" + Util.arredondar((this.progressoClickUpgrade / this.clicksParaUpgrade * 100) , 1) + "%)"
}

MainClick.CartelEvent = {};
MainClick.CartelEvent.ativo = false;

MainClick.CartelEvent.contarClick = function(){
    MainClick.CartelEvent.clicksRestantes--;
    if (MainClick.CartelEvent.clicksRestantes == 0){
        document.getElementById("mainClick").removeEventListener("click", MainClick.CartelEvent.contarClick , "true");
        gerarUpgradeTag({
            "id": 0666,
            "nome":"O mestre do crime.",
            "descrição":"Após assistir às 3 horas e meia de O Irlandês, você conseguiu recuperar seu dinheiro perdido.",
            "valor": 100000, 
            "condição":function(){return (minaBitcoin.getQuantidade() >= 50)}, 
            "efeito":function(){MainClick.CartelEvent.finalizar()}, 
            "existe":false,
            "item": MainClick
        })
    }
}

MainClick.CartelEvent.ativarTema = function(){
    let root = document.body;
    root.style.setProperty("--bordaMain", "3px inset rgb(255, 90, 90)");
    root.style.setProperty("--bordaOpt", "2px outset rgb(255, 90, 90)");
    root.style.setProperty("--backgOpt", "rgb(112, 11, 11)");
    root.style.setProperty("--complementaryColor", "rgb(112, 11, 11)");
    root.style.setProperty("--mainColor", "rgb(201, 15, 15)");
    root.style.setProperty("--botaoDefault", "rgb(216, 18, 18)");
    root.style.setProperty("--botaoActive", "rgb(112, 11, 11)");
}
   

MainClick.CartelEvent.desativarTema = function(){
    let root = document.body;
    root.style.setProperty("--bordaMain", "3px inset rgb(12, 115, 163)");
    root.style.setProperty("--bordaOpt", "2px outset rgb(12, 115, 163)");
    root.style.setProperty("--backgOpt", "rgb(8, 63, 88)");
    root.style.setProperty("--complementaryColor", "rgb(8, 63, 88)");
    root.style.setProperty("--mainColor", "rgb(11, 92, 129)");
    root.style.setProperty("--botaoDefault", "rgb(14, 127, 179)");
    root.style.setProperty("--botaoActive", "rgb(8, 63, 88)");
}

MainClick.CartelEvent.ativar = function() {
    MainClick.CartelEvent.ativo = true;
    MainClick.CartelEvent.clicksRestantes = 1000;
    MainClick.CartelEvent.dpcPerdido = Util.arredondar((MainClick.dpc / 2), 1)
    MainClick.mudarDPC(MainClick.dpc - this.dpcPerdido);
    
    document.getElementById("mainClick").addEventListener("click", this.contarClick , "true");
    document.getElementById("upgradeInfo").style.backgroundColor = "rgb(255, 90, 90)"

    MainClick.CartelEvent.ativarTema()

}

MainClick.CartelEvent.finalizar = function(){
    this.ativo = false;
    MainClick.somarDPC(this.dpcPerdido * 1.5);
    document.getElementById("upgradeInfo").style.backgroundColor = "rgb(14, 127, 179)"
    MainClick.CartelEvent.desativarTema();  
}
