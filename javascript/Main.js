var itens = [];
var num = 0;

Tempo = {}

Tempo.ticks = 0;

Tempo.emMilissegundos = function(){return this.ticks;};
Tempo.emSegundos = function(){return (this.ticks / 1000);};
Tempo.emMinutos = function(){return (this.ticks / 60000);};
Tempo.timer = -1 // -1 = Nao esta ativo
Tempo.start = function(){
	if (this.timer == -1) this.timer =  window.setInterval(function(){Tempo.ticks++;} , 0);
}
Tempo.stop = function(timer){
	if (this.timer != -1){
		window.clearInterval(this.timer);
		this.timer = -1
	}
}
Tempo.restart = function(){
	Tempo.ticks = 0;
}

/* ===========================================================================
	BOLSA DE VALORES:
==============================================================================*/

Bolsa = {}
Bolsa.valor = 0 // -> 1 minuto 30 segundos de produção
Bolsa.rendimento = 0; // -> Um rendimento inicial talvez
Bolsa.dps = 0;
Bolsa.dolsProduzidos = 0;
Bolsa.ganhos = 0; // -> Comeca com o prejuizo da compra
Bolsa.estado = 0; // ->  1 = neutra || 2 = ascendencia || 3 = decadencia
Bolsa.estadoAnterior = 0; 
Bolsa.estadoStreak = 0; 
Bolsa.novoEstadoEm = 1; // Tempo para trocar de estado. Em ticks (1 tick = 90 segundos) 
Bolsa.estadoTempoMax = 0;

Bolsa.atualizarEstadoText = function(estado){
	let strEstados = {
		1 : "<font color='grey'> estável </font>",
		2 : "<font color='green'> valorizando </font>",
		3 : "<font color='red'> desvalorizando </font>",
	}

	document.getElementById("bolsaEstado").innerHTML = "Estado: " + strEstados[estado];

}

Bolsa.alternarEstado = function(){
    var r2 = Util.Aleatorio.int(0, 105);

    if (Bolsa.rendimento == 0){
        Bolsa.estado = (Util.Aleatorio.int(1, 2) == 1)? 2 : 3;
    }else if (r2 > 100 || Bolsa.estadoTempoMax == 0){
        Bolsa.estado = 1;
    }else if (Bolsa.rendimento > 0){
        Bolsa.estado = (r2 > (Bolsa.rendimento * 100/60) + (3 * Bolsa.estadoStreak)) ? 2 : 3;
    } else {
        Bolsa.estado = (r2  > (-Bolsa.rendimento * 100/20) + (4 * Bolsa.estadoStreak))? 3 : 2;
    }

    if (Bolsa.estado != Bolsa.estadoAnterior){
		Bolsa.atualizarEstadoText(Bolsa.estado);
        Bolsa.estadoAnterior = Bolsa.estado;
        Bolsa.estadoTempoMax = 4;
        Bolsa.estadoStreak = 1;
    } else {
        Bolsa.estadoTempoMax --;
        Bolsa.estadoStreak ++;
    }

    Bolsa.novoEstadoEm = Util.Aleatorio.int(1, Bolsa.estadoTempoMax);
}

Bolsa.ascender = function(){
    Bolsa.rendimento += Util.Aleatorio.int(1, 4)
}

Bolsa.cair = function(){
    Bolsa.rendimento += Util.Aleatorio.int(-1, -3)
}

Bolsa.variar = function(){
    if (Bolsa.estado == 1) {}
    else if(Bolsa.estado == 2){Bolsa.ascender()}
	else if(Bolsa.estado == 3){Bolsa.cair()}
	
    Bolsa.novoEstadoEm--;

    if (Bolsa.novoEstadoEm == 0){
        Bolsa.alternarEstado()
	} 
	
	if (Bolsa.estado == 0){
		Bolsa.recalcularValor();
	}

	Bolsa.recalcularGanhos();
	document.getElementById("bolsaRendimento").innerHTML = Bolsa.rendimento + " %"
}


Bolsa.recalcularValor = function(){
	Bolsa.valor = Math.round((Jogo.getDPS() * 12) * (1 + (Bolsa.rendimento/2) / 100)); // 12 segundos do DPS + metade do rendimento da bolsa 
	document.getElementById("bolsaValor").innerHTML = "Valor para contrato: " + Util.conversor(Bolsa.valor);
}

Bolsa.setDPS = function(dps){ Bolsa.dps = dps;}

Bolsa.recalcularDPS = function(){
	Bolsa.dps = Jogo.dps * 0.2;
	document.getElementById("bolsaDPS").innerHTML = "DPS: " + Util.conversor(Bolsa.dps);
}

Bolsa.recalcularGanhos = function(){
    Bolsa.ganhos = (Bolsa.dolsProduzidos * (1 + Bolsa.rendimento/100)) - Bolsa.valor
}


Bolsa.reset = function(){
	Bolsa.recalcularValor() // -> 5 minutos de produção
	Bolsa.rendimento = 0; // -> Um rendimento inicial talvez
	Bolsa.dps = 0;
	Bolsa.dolsProduzidos = 0;
	Bolsa.ganhos = 0;
}


Bolsa.investir = function(){
	if (Jogo.dols >= Bolsa.valor){

		Jogo.gastarDols(Bolsa.valor);
		Bolsa.ganhos = -Bolsa.valor;
		
		Bolsa.interval1 = window.setInterval(() => {
			Bolsa.produzir();
		}, 50)

		Jogo.bolsaAtiva = true;
		Bolsa.estado = 1;

		Bolsa.setDPS(Jogo.dps * 0.2);
		Jogo.recalcularDPS();

		document.getElementById("bolsaDPS").innerHTML = "DPS: " + Util.conversor(Bolsa.dps);
		document.getElementById("bolsaDolsProduzidos").innerHTML = "Dols produzidos: " + Util.conversor(Bolsa.dolsProduzidos);
		document.getElementById("bolsaGanhos").innerHTML = "Ganhos: " + Util.conversor(Bolsa.ganhos);

		document.getElementById("bolsaGeralInfos").style.display = "none";
		document.getElementById("bolsaAtivaInfos").style.display = "initial";
	}
}

Bolsa.encerrar = function(){
	
	Jogo.somarDols(Bolsa.dolsProduzidos * (1 + Bolsa.rendimento));
    
    window.clearInterval(Bolsa.interval1);
	
	Bolsa.reset();

	Jogo.bolsaAtiva = false;
	Bolsa.estado = 0;

	Jogo.recalcularDPS();

	document.getElementById("bolsaGeralInfos").style.display = "initial";
	document.getElementById("bolsaAtivaInfos").style.display = "none";
}

/* Usado pro teste no console

Bolsa.mostrarDados = () => {
    console.log("Rendimento: " + Bolsa.rendimento);
    console.log("DPS: " + Bolsa.dps);
    console.log("Dols produzidos: " + Bolsa.dolsProduzidos);
    console.log("Ganhos: " + Bolsa.ganhos);
}
*/

Bolsa.somarDols = function(dols){
    Bolsa.dolsProduzidos += dols;
	Bolsa.recalcularGanhos();
	
	document.getElementById("bolsaDolsProduzidos").innerHTML = "Dols produzidos: " + Util.conversor(Util.arredondar(Bolsa.dolsProduzidos, 1));
	document.getElementById("bolsaGanhos").innerHTML = "Ganhos: " + Util.conversor(Util.arredondar(Bolsa.ganhos, 1));
}

Bolsa.produzir = function(){
    Bolsa.somarDols(Bolsa.dps/20);
}

Bolsa.init = function(){
    Tempo.start()

	Bolsa.variar();
    Bolsa.interval2 = window.setInterval(() => {Bolsa.variar()}, 60000); //1 min e 00 seg
	
	Bolsa.recalcularValor();

	Jogo.bolsaAtiva = false;
	Bolsa.estado = 0;

	document.getElementsByClassName("escondido")[0].className = "";
	document.getElementById("bolsaRendimento").innerHTML = "0 %";
	
}

//Função para admin
Bolsa.setEstado = function(estado){
	if (3 >= estado >= 1){
		Bolsa.estado = estado;
		Bolsa.atualizarEstadoText(estado);
	}
}

class Item{
	constructor(nome, nomeTextual, valor, producao){
		this.nome = nome;
		this.nomeTextual = nomeTextual
		this.valor = valor;
		this.quantidade = 0;
		this.producaoBase = producao; //DpS sem efeitos de buff. 
		this.producao = producao;
		this.producaoTotal = this.quantidade * this.producao;
		this.itemNum = num;
		this.buffs = [];
		num++;
		itens.push(this);
	}

    getNome(){return this.nome;}

	getValor(){return this.valor;}
	setValor(val){this.valor = val;}
	
	getProducaoBase(){return this.producaoBase;}
	setProducaoBase(prdB){this.producaoBase = prdB;}

    getProducao(){return this.producao;}
    setProducao(prd){this.producao = prd;}

	getQuantidade(){return this.quantidade;}
    setQuantidade(qtd){this.quantidade = qtd;}

	getProducaoTotal(){return this.producaoTotal;}
	setProducaoTotal(prdT){this.producaoTotal = prdT;}
	
	recalcularProducao(){
		var novoDPS = this.producaoBase;
		for (var buff in this.buffs){
			novoDPS += this.buffs[buff]();
		}
		this.producao = novoDPS;
		this.producaoTotal = this.producao * this.quantidade;
	}

	addBuff(buff){
		this.buffs.push(buff);
		this.recalcularProducao();
	}

}


var fabricante = new Item("fabricante", "Fabricante", 10, 0.2);
var fabrica = new Item("fabrica", "Fábrica", 100, 5);
var multinacional = new Item("multinacional", "Multi-nacional", 1100, 50);
var planetaria = new Item("planetaria", "Planetária", 12000, 200);
var minaBitcoin = new Item("minaBitcoin", "Mina de Bitcoin", 30000, 2000);
var monoInt = new Item("monoInt", "Monopólios Interplanetários", 110000, 7500);

itens.map(item => item.itemNum < (itens.length - 1) ? document.getElementById(item.nome + "Compra").addEventListener("click", function () { evento(item) }, true) : console.log());


function comprarItem(item) {
	
	if (Jogo.dols >= item.getValor()) {
		Jogo.gastarDols(item.getValor());

        item.setQuantidade(item.getQuantidade() + 1);
        item.setValor(item.getValor() + Math.round(item.getValor() / 10));-
        item.setProducaoTotal(item.getProducao() * item.getQuantidade());		
		mostrarItem(item.itemNum);
        
        // PROVISORIO
        Jogo.recalcularDPS();
        

        //PROVISORIO
		
        upgradeList = Upgrades[item.nome];
        for (id in upgradeList) {
            if (!upgradeList[id].existe) {
                desbloquearUpgrade(upgradeList[id]);
            }
		}
    }
}


function comprarUpgrade(upgrade){
	if (Jogo.dols >= upgrade.valor){
		upgrade.efeito();
		
		element = document.getElementById(upgrade.id);
		element.parentNode.removeChild(element);
		esconderUpgradeDescricao();

		Jogo.gastarDols(upgrade.valor);
		
		//PROVISORIO
		if (upgrade.item != MainClick){
			upgrade.item.recalcularProducao();
			Jogo.recalcularDPS();
			Interface.atualizarTextoInfo(document.getElementById((upgrade.item.nome + "Text")), upgrade.item);
			mostrarItem(upgrade.item.itemNum);				
		}
	}
}

//METODOS DE UPGRADE

function gerarUpgradeTag(upgrade){
	upgrade.existe = true;

	novaDiv = document.createElement("div");
	novaDiv.id = upgrade.id;
	novaDiv.className = "upgrade-model";

	novaDiv.onclick = function(){comprarUpgrade(upgrade)};
	novaDiv.innerHTML = "<p class='titulo'>" + upgrade["nome"] + "<br> Đ " + upgrade["valor"] + "</p>";
	novaDiv.onmouseenter = function() {
		atualizarUpgradeDescricao(upgrade);
	};
	novaDiv.onmouseleave = function() {
		esconderUpgradeDescricao();
	};
	document.getElementById("upSec").appendChild(novaDiv);
}

function desbloquearUpgrade(upgrade){
	if (upgrade.condição()){
		gerarUpgradeTag(upgrade);
	}
}





// METODOS GERAIS

function produzir(){
	Jogo.somarDols(Jogo.dps/20);
}

function clique() {
	MainClick.clicar();
}

// listeners pra aparecer o proximo botao

function evento(item) {
	var index = item.itemNum;
	index += 2;
	if(item.getQuantidade() >= 1){
		document.getElementById("navbar_items_op" + index).style.display = "inline-block";
		document.getElementById(item.nome + "Compra").removeEventListener("click", this, true);
	}
}

itens.map(item => item.itemNum < (itens.length - 1) ? document.getElementById(item.nome + "Compra").addEventListener("click", function () { evento(item) }, true) : console.log());


/* ===========================================================================
	UPGRADES:
==============================================================================*/

Upgrades = {
	"fabricante":[
		{
			"id": 1000,
			"nome":"Leis Trabalhistas",
			"descrição":"Agora eles possuem o poder do auxílio desemprego, e são despedidos menos. Produção de fabricantes: x2",
			"valor": 2000, 
			"condição":function(){return (fabricante.getQuantidade() >= 20)}, 
			"efeito":function(){fabricante.setProducaoBase(fabricante.getProducaoBase() * 2)}, 
			"existe":false,
			"item": fabricante
		},
		{
			"id": 1001,
			"nome":"Melhores Sálarios", 
			"descrição":"Fabricantes receberão um salário mínimo. Produção de fabricantes: x3", 
			"valor": 10000,
			"condição":function(){return (fabricante.getQuantidade() >= 60)}, 
			"efeito":function(){fabricante.setProducaoBase(fabricante.getProducaoBase() * 4	)},
			"existe":false,
			"item": fabricante
		},
		{
			"id": 1002,
			"nome":"Férias Remuneradas", 
			"descrição":"Fabricantes agora recebem nas férias. Produção de fabricantes: x2", 
			"valor": 20000,
			"condição":function(){return (fabricante.getQuantidade() >= 80)}, 
			"efeito":function(){fabricante.setProducaoBase(fabricante.getProducaoBase() * 2	)},
			"existe":false,
			"item": fabricante
		},
		{
			"id": 1003,
			"nome":"Viagens a trabalho", 
			"descrição":"Fabricantes agora podem viajar a trabalho. Fabricante robôs não lidam tão bem com a mudança de clima. Produção de fabricantes: x5 (aviso: não funciona tão bem com robôs)", 
			"valor": 70000,
			"condição":function(){return (fabricante.getQuantidade() >= 100)}, 
			"efeito": function () { if (Upgrades["fabrica"][3].existe) { fabricante.setProducaoBase(fabricante.getProducaoBase() * 2.5) } else { fabricante.setProducaoBase(fabricante.getProducaoBase() * 5) } },
			"existe":false,
			"item": fabricante
		},
	],

	"fabrica":[
		{
			"id": 2000,
			"nome":"Faxineiros",
			"descrição":"Agora o lugar inteiro será limpo devidamente. Produção das fábricas: x2",
			"valor": 15000, 
			"condição":function(){return (fabrica.getQuantidade() >= 20)}, 
			"efeito":function(){fabrica.setProducaoBase(fabrica.getProducaoBase() * 2)}, 
			"existe":false,
			"item": fabrica
		},
		{
			"id": 2001,
			"nome":"Revolução Industrial",
			"descrição":"Máquinas auxiliarão no trabalho. Produção das fábricas: x3",
			"valor": 25000, 
			"condição":function(){return (fabrica.getQuantidade() >= 50)}, 
			"efeito":function(){fabrica.setProducaoBase(fabrica.getProducaoBase() * 3)}, 
			"existe":false,
			"item": fabrica
		},
		{
			"id": 2002,
			"nome":"Música no Trabalho", 
			"descrição":"Os trabalhadores trabalharam melhor. Produção de fabrica: +2% pra cada fabricante.", 
			"valor": 10000,
			"condição":function(){return (fabrica.getQuantidade() >= 60)}, 
			"efeito":function(){fabrica.addBuff(function(){return fabrica.getProducaoBase() * (0.02 * fabricante.getQuantidade())})},
			"existe":false,
			"item": fabrica
		},
		{
			"id": 2003,
			"nome":"Empregados Robôs", 
			"descrição":"Os trabalhadores agora são ciborgues. Produção de fabricante: +50% pra cada fabrica.", 
			"valor": 15000,
			"condição":function(){return (fabrica.getQuantidade() >= 80)}, 
			"efeito":function(){fabricante.addBuff(function(){return fabricante.getProducaoBase() * (0.5 * fabrica.getQuantidade())})},
			"existe":false,
			"item": fabrica
		},
		{
			"id": 2004,
			"nome":"Escorregadores na Fábrica", 
			"descrição":"Facilita a locomoção dos robôs, fazendo-os produzir ainda mais. Produção das Fábricas x2", 
			"valor": 15000,
			"condição":function(){return (fabrica.getQuantidade() >= 100)}, 
			"efeito":function(){fabrica.setProducaoBase(fabrica.getProducaoBase() * 2)},
			"existe":false,
			"item": fabrica
		},
	],
	"multinacional":[
		{
			"id": 3000,
			"nome":"Fora da cidade",
			"descrição":"As multinacionais irão ser construídas em todo o estado. Produção de multinacionais: x2",
			"valor": 20000, 
			"condição":function(){return (multinacional.getQuantidade() >= 20)}, 
			"efeito":function(){multinacional.setProducaoBase(multinacional.getProducaoBase() * 2)}, 
			"existe":false,
			"item": multinacional
		},
		{
			"id": 3001,
			"nome":"Multi-línguas",
			"descrição":"Os funcionários dominarão mais de um idioma. Produção de multinacionais: x3",
			"valor": 60000, 
			"condição":function(){return (multinacional.getQuantidade() >= 60)}, 
			"efeito":function(){multinacional.setProducaoBase(multinacional.getProducaoBase() * 3)}, 
			"existe":false,
			"item": multinacional
		},
		{
			"id": 3002,
			"nome":"Cartel",
			"descrição":"As multinacionais agora lidam com negócios ilegais. Isso veio com seu preço. Produção de multinacionais: x10;\n Dols por Click /2 até você clicar 1000x",
			"valor": 60000, 
			"condição":function(){return (multinacional.getQuantidade() >= 100)}, 
			"efeito": function () { multinacional.setProducaoBase(multinacional.getProducaoBase() * 10); MainClick.CartelEvent.ativar();}, 
			"existe":false,
			"item": multinacional
		},
	],
	
	"planetaria":[
		{
			"id": 4000,
			"nome":"Patrocínio do Elon Musk",
			"descrição":"O Deus Supremo do espaço sideral decidiu te apoiar. Produção das planetárias: x2",
			"valor": 40000, 
			"condição":function(){return (planetaria.getQuantidade() >= 20)}, 
			"efeito":function(){planetaria.setProducaoBase(planetaria.getProducaoBase() * 2)}, 
			"existe":false,
			"item": planetaria
		},
		{
			"id": 4001,
			"nome":"Marketing de Viagem Espacial",
			"descrição":"O poder da propaganda faz mais pessoas irem para as planetárias. Produção das planetárias: x4",
			"valor": 180000, 
			"condição":function(){return (planetaria.getQuantidade() >= 60)}, 
			"efeito":function(){planetaria.setProducaoBase(planetaria.getProducaoBase() * 4)}, 
			"existe":false,
			"item": planetaria
		},
		{
			"id": 4002,
			"nome":"Planetárias nos Monopólios Interplanetários",
			"descrição":"Seus Monopólios Interplanetários são Monopólios Interplanetárias agora. Produção das planetárias: x3",
			"valor": 150000, 
			"condição":function(){return ((planetaria.getQuantidade() >= 100) && (monoInt.getQuantidade() >= 1))}, 
			"efeito":function(){planetaria.setProducaoBase(planetaria.getProducaoBase() * 3)}, 
			"existe":false,
			"item": planetaria
		},
		
	],
	"minaBitcoin":[
		{
			"id": 5000,
			"nome":"e-mineiros",
			"descrição":"Os e-mineiros iram auxiliar na coleta de bitcoins. Produção da Mina de bitcoins: x2",
			"valor": 40000, 
			"condição":function(){return (minaBitcoin.getQuantidade() >= 20)}, 
			"efeito":function(){minaBitcoin.setProducaoBase(minaBitcoin.getProducaoBase() * 2)}, 
			"existe":false,
			"item": minaBitcoin
		},
		{
			"id": 5001,
			"nome":"Vale S.A. da InterWebs",
			"descrição":"Agora tem uma empresa que minera. Só cuidado com as barragens. Produção da Mina de bitcoins: x4",
			"valor": 100000, 
			"condição":function(){return (minaBitcoin.getQuantidade() >= 50)}, 
			"efeito":function(){minaBitcoin.setProducaoBase(minaBitcoin.getProducaoBase() * 4)}, 
			"existe":false,
			"item": minaBitcoin
		},
		{
			"id": 5002,
			"nome":"Bitcoin Sintética",
			"descrição":"Descobriram como produzir Bitcoins nas fábricas, mas isso diminuiu o valor das Bitcoins. Produção da Mina de bitcoins: 25% menor, produção das fábricas 125% maior",
			"valor": 150000, 
			"condição":function(){return (minaBitcoin.getQuantidade() >= 100)}, 
			"efeito":function(){minaBitcoin.setProducaoBase(minaBitcoin.getProducaoBase() * 0.75); fabrica.setProducaoBase(fabrica.getProducaoBase() * 2.25)}, 
			"existe":false,
			"item": minaBitcoin
		},
	],
	"monoInt":[
		{
			"id": 6000,
			"nome":"Bolsa de valores",
			"descrição":"Libera o sistema de Bolsa de valores.",
			"valor": 100000, 
			"condição":function(){return (monoInt.getQuantidade() >= 10)}, 
			"efeito":function(){Jogo.liberarBolsa();}, 
			"existe":false,
			"item": monoInt
		},
		{
			"id": 6001,
			"nome":"Colônias em Marte",
			"descrição":"Monopólios interplanetários agora são realmente interplanetários. Produção dos Monopólios Interplanetário x2.",
			"valor": 100000, 
			"condição":function(){return (monoInt.getQuantidade() >= 20)}, 
			"efeito": function () {monoInt.setProducaoBase(monoInt.getProducaoBase() * 2);}, 
			"existe":false,
			"item": monoInt
		},
		{
			"id": 6002,
			"nome":"Colônias em Júpiter",
			"descrição":"Seus monopólios agora vivem no olho dos furacões de Júpiter. Uma pena que os testes foram custosos. Quantidade de Monopólios Interplanetários -10; Produção dos Monopólios Interplanetário x4.",
			"valor": 100000, 
			"condição":function(){return (monoInt.getQuantidade() >= 50)}, 
			"efeito": function () {monoInt.setQuantidade(monoInt.getQuantidade() - 10); monoInt.setProducaoBase(monoInt.getProducaoBase() * 4);}, 
			"existe":false,
			"item": monoInt
		},
		{
			"id": 6003,
			"nome":"Monopólios intersistemáticos",
			"descrição":"Agora nós chegamos em outros sistemas solares. Produção dos Monopólios Interplanetário x2.",
			"valor": 100000, 
			"condição":function(){return (monoInt.getQuantidade() >= 100)}, 
			"efeito": function () {monoInt.setProducaoBase(monoInt.getProducaoBase() * 2);}, 
			"existe":false,
			"item": monoInt
		},
	],
}

clickUpgrades = {
	500:{
		"id": 0000,
		"nome": "Clickerboy",
		"descrição": "Os cliques terão sua técnica mais afiada. Dols por clique: 2x",
		"valor": 2000,
		"efeito": function(){MainClick.somarDPC(MainClick.dpc)},
		"existe": false,
		"item": MainClick
	},
	700:{
		"id": 0001,
		"nome": "Bônus Bônus",
		"descrição": "Dará um bônus no bônus de dols. Multiplicador do Bônus: +2",
		"valor": 6000,
		"efeito": function(){MainClick.multiplicadorClickBonus += 2},
		"existe": false,
		"item": MainClick
	},
	1500:{
		"id": 0002,
		"nome": "Clickerman",
		"descrição": "Os cliques possuem mais força interior. Dols por clique: 2x",
		"valor": 10000,
		"efeito": function(){MainClick.somarDPC(MainClick.dpc)},
		"existe": false,
		"item": MainClick
	}
}

window.setInterval(produzir, 50);