class Item{
	 
	constructor(nome, valor, producao, botao){
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

}

class Interface {
	constructor() {
        if (this.constructor == Interface) {
            throw new TypeError("finge q nao viu nada");
        }
	}

    static atualizarTextoCompra(botao, item) {
        botao.innerHTML = "Comprar " + item.nome + ": " + item.valor;
    }

    static atualizarTextoInfo(texto, item){
        texto.innerHTML = item.nome + ": " + item.quantidade + " (" + item.producaoTotal + " DpS)";
    }

}

function comprarItem(item) {

    if (dols >= item.getValor()) {
        dols -= item.getValor();
        item.setQuantidade(item.getQuantidade() + 1);

        setDpS(dolsPorSegundo + item.getProducao());
        item.setProducaoTotal(item.getProducaoTotal() + item.getProducao());

        item.setValor(item.getValor() + Math.round(item.getValor() / 10));
		
        item.setProducaoTotal();
        Interface.atualizarTextoCompra(document.getElementById(item.id + "Compra"), item);
        Interface.atualizarTextoInfo(document.getElementById(item.id + "Text"), item);
        
        // PROVISORIO
        atualizarDolText();
        atualizarDpSText();

        //PROVISORIO
        if (item["id"] < 3) {
            if (comprasButtonPorId[item["id"] + 1].style.display == "none") {
                comprasButtonPorId[item["id"] + 1].style.display = "inline-block";
            }
        }
		
        upgradeList = Upgrades[item];
        for (id in upgradeList) {
            if (!upgradeList[id].existe) {
                desbloquearUpgrade(upgradeList[id]);
            }
        }
    }
}