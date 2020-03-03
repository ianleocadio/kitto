window.addEventListener('load', function() {
    
    var up = new Upgrade(18, 'Diogo', 200, 10);
    console.log(localStorage.getItem(dols));
});

class Upgrade {
    constructor(id, nome, preco, efeito) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.efeito = efeito;
    }

    getNome() {
        return nome;
    }
}