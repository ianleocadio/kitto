//navbar_items_op1
var button = document.getElementById("mainClick");

var lastIndex = 0;
var item_img = $('#item_img');
var item_nome = $('#item_nome');
var item_preco = $('#item_preco');
var item_qnt = $('#item_qnt');
var item_dps = $('#item_dps');

var button = document.getElementById("mainClick");

button.addEventListener('click', function () {
    var id = setInterval(frame, 10);
    var x = 1;
    var rotateX = 10;
    var popIn = true;

    function frame() {
        if (x > 1) {
            clearInterval(id);
        } else {
            if (popIn) {
                x -= .1;
                y = -10;
                if (x <= .8) {
                    popIn = false;
                }
            } else {
                x += .05;
                y = 10;
            }

            button.style.transform = "rotate(" + y + "deg)";
            button.style.transform = "scale(" + x + "," + x + ")";
        }
    }
});
$(function () {
    mostrarItem(0);
})

function mostrarItem(index) {
    upgrade = itens[index];
    document.getElementById(itens[lastIndex]['nome'] + "Compra").style.display = "none";
    item_img.attr("src", "images/icons/" + upgrade['nome'] + ".jpg");
    item_nome.text(upgrade['nomeTextual']);
    item_preco.text("Preço: Đ " + Util.conversor(upgrade['valor']));
    item_qnt.text("Quantidade: " + upgrade['quantidade']);
    item_dps.text("DpS: Đ " + upgrade['producaoBase']);


    document.getElementById(upgrade['nome'] + "Compra").style.display = "initial";
    lastIndex = index;
}

function atualizarUpgradeDescricao(upgrade) {
    var upgradeInfo = document.getElementById("upgradeInfo");
    upgradeInfo.innerHTML = upgrade['descrição'];
    upgradeInfo.style.display = "initial";
}

function esconderUpgradeDescricao() {
    document.getElementById('upgradeInfo').style.display = "none";
}

document.getElementById("navbar-main-op2").addEventListener('click', function() {
    document.getElementById("informacao_dps").innerHTML = Jogo.dps;
    document.getElementById("informacao_cps").innerHTML = MainClick.getDPC();
    document.getElementById("informacao_clicks").innerHTML = MainClick.quantidadeDeClicks;
    document.getElementById("informacao_dols_total").innerHTML = "In future of the world of the Brazil man";
});

function drawCircle() {
    var canvas = document.getElementById("canvas_mainClick");
    if (!canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 30;
    ctx.strokeStyle = "#F39C11";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(250, 250, 160, 0, MainClick.progressoClickBonus * 36 / 180 * Math.PI, false);
    ctx.stroke();
}