var titulo = document.querySelector(".tit-enc");
titulo.textContent = "Lista de Encomendas";

var linhasTabela = document.querySelectorAll(".linhas");

for(var i = 0; i < linhasTabela.length; i++) {

    var quantidade = linhasTabela[i].querySelector(".info-qtd").textContent;
    var valoruni = linhasTabela[i].querySelector(".info-valor").textContent;

    var calc_total = quantidade * valoruni;

    linhasTabela[i].querySelector(".info-total").textContent = calc_total;
}
