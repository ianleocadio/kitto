
class Item{
	 
	constructor(nome, valor, producao){
		this.nome = nome;
		this.valor = valor;
		this.producao = producao;
		this.quantidade = 0;
		this.producaoTotal = this.quantidade * this.producao;
	}

	getNome(){
		return this.nome;
	}
	
	getValor(){
		return this.valor;
	}
	setValor(val){
		this.valor = val;
	}
	
	
	getProducao(){
		return this.producao;
	}
	setProducao(prd){
		this.producao = prd;
	}

	getQuantidade(){
		return this.quantidade;
	}
	setQuantidade(qtd){
		this.quantidade = qtd;
	}

	getProducaoTotal(){
		return this.producaoTotal;
	}
	setProducaoTotal(prdT){
		this.producaoTotal = prdT;
	}

	atualizarProducaoTotal(){
		this.producaoTotal = this.producao * this.quantidade;
	}

	/*atualizarText(){
		document.getElementById(this.nome + "Text").innerHTML = this.nome + ": " + this.quantidade + " (" + this.producaoTotal + " DpS)";
	}

	atualizarTextoCompra() {
		document.getElementById("compra" + this.numero).innerHTML = "Comprar " + this.nome + ": " + this.valor;
	}*/
}

class Interface {
	constructor(nome) {
		this.nome = nome;
	}

}

//METODOS DE UPGRADE

function desbloquearUpgrade(upgrade){
	if (upgrade.condição()){
		gerarUpgradeTag(upgrade);
	}
}

function gerarUpgradeTag(upgrade){
	upgrade.existe = true;

	novaDiv = document.createElement("div");
	novaDiv.id = upgrade["id"];
	novaDiv.className = "upgrades";

	novaDiv.onclick = function(){comprarUpgrade(upgrade)};
	novaDiv.innerHTML = "<p class='titulo'>" + upgrade["nome"] + " (" + upgrade["valor"] + " dols)" + "</p>" + "<br>" + "<p class='info'>"  + upgrade["descrição"] + "</p>";
	document.getElementById("upSec").appendChild(novaDiv);
}

//METODOS DE COMPRA

function comprarItem(indice){
	item = itens[indice];

	if (dols >= item["objeto"].getValor()){
		dols -= item["objeto"].getValor();
		item["objeto"].setQuantidade(item["objeto"].getQuantidade() + 1);

		setDpS(dolsPorSegundo + item["objeto"].getProducao());
		item["objeto"].setProducaoTotal(item["objeto"].getProducaoTotal() + item["objeto"].getProducao());

		item["objeto"].setValor(item["objeto"].getValor() + Math.round(item["objeto"].getValor()/10));
		
		item.objeto.atualizarProducaoTotal();
		item.atualizarBotao();
		item.atualizarTexto();
		atualizarDolText();
		atualizarDpSText();

		//PROVISORIO
		if (item["id"] < 3){
			if (comprasButtonPorId[item["id"] + 1].style.display == "none") {
				comprasButtonPorId[item["id"] + 1].style.display = "inline-block";
			}
		}
		
		upgradeList = Upgrades[indice];
		for (id in upgradeList){
			if (!upgradeList[id].existe) {
				desbloquearUpgrade(upgradeList[id]);
			}
		}
	}
}

function comprarUpgrade(upgrade){
	if (dols >= upgrade["valor"]){
		upgrade.efeito();
		element = document.getElementById(upgrade["id"]);
		element.parentNode.removeChild(element);
		dols -= upgrade["valor"];
		
		if (upgrade["item"] != "click"){
			setDpS(dolsPorSegundo + itens[upgrade.item].objeto.getProducaoTotal());
			itens[upgrade.item].objeto.atualizarProducaoTotal();
			itens[upgrade.item].atualizarTexto();
			atualizarDpSText();		
		} else {
			atualizarDpCText();
		}

		atualizarDolText();
	}

}
//PROVISÓRIO
function arredondar(numero, casas){
	if (numero % 1 == 0){
		return numero;
	} else {
		return Number(numero.toFixed(casas));
	}
}

//FUNÇÕES DE ATUALIZAÇÃO DE TEXTO

function atualizarFabricanteText(){
	fabricanteText.style.display = "inline-block";
	producaoTotalFmt = arredondar(fabricante.getProducaoTotal(), 1);
	fabricanteText.innerHTML = "Fabricantes: " + String(fabricante.getQuantidade()) + " (" + String(producaoTotalFmt) + " DpS)";
}
function atualizarFabricaText(){
	if (fabricaText.style.display == "none"){
		fabricaText.style.display = "inline-block";
	}
	producaoTotalFmt = arredondar(fabrica.getProducaoTotal(), 1);
	fabricaText.innerHTML = "Fabricas: " + String(fabrica.getQuantidade()) + " (" + String(producaoTotalFmt) + " DpS)";
}
function atualizarMultinacionalText(){
	if (multinacionalText.style.display == "none"){
		multinacionalText.style.display = "inline-block";
	}
	producaoTotalFmt = arredondar(multinacional.getProducaoTotal(), 1);
	multinacionalText.innerHTML = "Multinacionais: " + String(multinacional.getQuantidade()) + " (" + String(producaoTotalFmt) + " DpS)";
}
function atualizarPlanetariaText(){
	if (planetariaText.style.display == "none"){
		planetariaText.style.display = "inline-block";
	}
	producaoTotalFmt = arredondar(planetaria.getProducaoTotal(), 1);
	planetariaText.innerHTML = "Planetarias: " + String(planetaria.getQuantidade()) + " (" + String(producaoTotalFmt) + " DpS)";
}

function atualizarDolText(){
	dolsText.innerHTML = Math.round(dols) + " (" + ((progressoClickBonus / 10) * 100) + "%)";
}
function atualizarDpSText(){
	dpsText.innerHTML = String(arredondar(dolsPorSegundo, 1)) + " DpS";
}
function atualizarDpCText(){
	dpcText.innerHTML = String(dolsPorClick) + " DpC" + " (" + arredondar(((progressoClickUpgrade / 140) * 100), 1) + "%)";
}


function atualizarCompra1Button(){
	compra1.innerHTML = "Comprar fabricante: " + String(fabricante.getValor()) + " dol";
}
function atualizarCompra2Button(){
	compra2.innerHTML = "Comprar fabrica: " + String(fabrica.getValor()) + " dol";
}
function atualizarCompra3Button(){
	compra3.innerHTML = "Comprar multi-nacional: " + String(multinacional.getValor()) + " dol";
}
function atualizarCompra4Button(){
	compra4.innerHTML = "Comprar planetaria: " + String(planetaria.getValor()) + " dol";
}

// METODOS GERAIS

function setDpC(value){
	dolsPorClick = value;
}
function setDpS(value){
	dolsPorSegundo = value;
}
function setDolsPorClick(value){
	dolsPorClick = value;
}

function clickBonus(){
	if (progressoClickBonus == 10){
		dols += multiplicadorClickBonus * dolsPorClick;
		progressoClickBonus = 0;
		progressoClickUpgrade += 3;
		atualizarDolText();
	}
}
function clickUpgrade(){

	if (progressoClickUpgrade >= 140){
		setDolsPorClick(arredondar(dolsPorClick * 1.5, 1));
		progressoClickUpgrade = 0;
	}
}

function produzir(){
	dols += dolsPorSegundo/20;
	atualizarDolText();
}
function clique(){
	dols += dolsPorClick;
	atualizarDolText();
}

function contarClick(){
	contadorClicks++;

	if (contadorClicks in clickUpgrades){
		gerarUpgradeTag(clickUpgrades[contadorClicks]);
	}

	//TUDO PRA BAIXO É PROVISÓRIO
	progressoClickBonus++;
	progressoClickUpgrade++;

	clickBonus();
	clickUpgrade();

	atualizarDpSText();
	atualizarDpCText();
}

// CONTANTES

const mainClick = document.getElementById("mainClick");

const compra1 = document.getElementById("compra1");
const compra2 = document.getElementById("compra2");
const compra3 = document.getElementById("compra3");
const compra4 = document.getElementById("compra4");

const dolsText = document.getElementById("dolsText");
const dpcText = document.getElementById("dpcText");
const dpsText = document.getElementById("dpsText");
const fabricanteText = document.getElementById("fabricanteText");
const fabricaText = document.getElementById("fabricaText");
const multinacionalText = document.getElementById("multinacionalText");
const planetariaText = document.getElementById("planetariaText");

const comprasButtonPorId = [compra1, compra2, compra3, compra4];

//LISTENER
mainClick.addEventListener("click", contarClick, true);


// VARIAVEIS

var fabricante = new Item("Fabricante", 10, 0.2);
var fabrica = new Item("Fabrica", 100, 2);
var multinacional = new Item("Multi nacional", 1100, 20);
var planetaria = new Item("Planetaria",12000, 100);

var dols = 0;
var dolsPorClick = 1;
var dolsPorSegundo = 0;
var contadorClicks = 0;
var multiplicadorClickBonus = 4;

var upgradeComprado = false;

itens = {
	"fabricante":{"objeto":fabricante, "atualizarTexto":atualizarFabricanteText, "atualizarBotao":atualizarCompra1Button, id: 0},
	"fabrica":{"objeto":fabrica, "atualizarTexto":atualizarFabricaText, "atualizarBotao":atualizarCompra2Button, id: 1},
	"multinacional":{"objeto":multinacional, "atualizarTexto":atualizarMultinacionalText, "atualizarBotao":atualizarCompra3Button, id: 2},
	"planetaria":{"objeto":planetaria, "atualizarTexto":atualizarPlanetariaText, "atualizarBotao":atualizarCompra4Button, id: 3}
}

//PROVISÓRIO (Ta dificil de trabalhar)
Upgrades = {
	"fabricante":[
		{
			"id": 0,
			"nome":"Melhores condições de trabalho",
			"descrição":"O ambiente de trabalho dos fabricantes será mais agradável. Produção de fabricantes: x2",
			"valor": 2000, 
			"condição":function(){return (fabricante.getQuantidade() >= 20)}, 
			"efeito":function(){fabricante.setProducao(fabricante.getProducao() * 2)}, 
			"existe":false,
			"item":"fabricante"
		},
		{
			"id": 1,
			"nome":"Melhores sálarios", 
			"descrição":"Fabricantes receberão um salário mínimo. Produção de fabricantes: x2", 
			"valor": 10000,
			"condição":function(){return (fabricante.getQuantidade() >= 60)}, 
			"efeito":function(){fabricante.setProducao(fabricante.getProducao() * 2)},
			"existe":false,
			"item":"fabricante" 
		}
	],

	"fabrica":[
		{
			"id": 2,
			"nome":"Faxineiros",
			"descrição":"Agora o lugar inteiro será limpo devidamente. Produção das fábricas: x2",
			"valor": 15000, 
			"condição":function(){return (fabrica.getQuantidade() >= 20)}, 
			"efeito":function(){fabrica.setProducao(fabrica.getProducao() * 2)}, 
			"existe":false,
			"item":"fabrica"
		},
		{
			"id": 3,
			"nome":"Máquinas?",
			"descrição":"Máquinas auxiliarão no trabalho. Produção das fábricas: x2",
			"valor": 25000, 
			"condição":function(){return (fabrica.getQuantidade() >= 50)}, 
			"efeito":function(){fabrica.setProducao(fabrica.getProducao() * 2)}, 
			"existe":false,
			"item":"fabrica"
		}
	]
	
}

clickUpgrades = {
	500:{
		"id": 4,
		"nome": "Clickerboy",
		"descrição": "Os cliques terão sua técnica mais afiada. Dols por clique: 2x",
		"valor": 2000,
		"efeito": function(){setDpC(dolsPorClick * 2)},
		"existe": false,
		"item": "click"
	},
	700:{
		"id": 5,
		"nome": "Bônus Bônus",
		"descrição": "Dará um bônus no bônus de dols. Multiplicador do Bônus: + 2",
		"valor": 6000,
		"efeito": function(){multiplicadorClickBonus += 2},
		"existe": false,
		"item": "click"
	},
	1500:{
		"id": 6,
		"nome": "Clickerman",
		"descrição": "Os cliques possuem mais força interior. Dols por clique: 2x",
		"valor": 10000,
		"efeito": function(){setDpC(dolsPorClick * 2)},
		"existe": false,
		"item": "click"
	}
}


window.setInterval(produzir, 50);