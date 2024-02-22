var titulo = document.querySelector(".tit-enc");
titulo.textContent = "Lista de Encomendas";

var linhasTabela = document.querySelectorAll(".linhas");

for(var i = 0; i < linhasTabela.length; i++) {

    var quantidade = linhasTabela[i].querySelector(".info-qtd").textContent;
    var valoruni = linhasTabela[i].querySelector(".info-valor").textContent;

    //Valida a quantidade
    if(quantidade < 1 || isNaN(quantidade)){
        //Quantidade NOK --- Reportar ao usuário
        linhasTabela[i].querySelector(".info-qtd").textContent = "QUANTIDADE INVÁLIDA!";
        linhasTabela[i].querySelector(".info-qtd").style.color = "red";
    }else{
        //Quantidade OK --- Prosseguir
        if(isNaN(valoruni)){
            //Valor NOK --- Reportar ao usuário
            linhasTabela[i].querySelector(".info-valor").textContent = "VALOR INVÁLIDO!";
            linhasTabela[i].style.backgroundColor = "red";
        }else{
            //Valor OK --- Prosseguir
            linhasTabela[i].querySelector(".info-total").textContent = "R$ " + calcularTotal(quantidade,valoruni);
        }
    }
}

//Funcao para Calcular Valor Total da Encomenda

function calcularTotal(quantidade,valoruni){
    var total = 0;
    total = quantidade * valoruni;;

    return total;
}