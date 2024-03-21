var titulo = document.querySelector(".tit-enc");
titulo.textContent = "Lista de Encomendas";

var linhasTabela = document.querySelectorAll(".linhas");

for (var i = 0; i < linhasTabela.length; i++) {
    var quantidade = linhasTabela[i].querySelector(".info-qtd").textContent;
    var valoruni = parseFloat(linhasTabela[i].querySelector(".info-valor").textContent);

    // Validar quantidade e valor unitário
    if (!validarQuantidade(quantidade)) {
        linhasTabela[i].querySelector(".info-qtd").textContent = "QUANTIDADE INVÁLIDA!";
        linhasTabela[i].querySelector(".info-qtd").style.color = "red";
    } else if (!validarValorUnitario(valoruni)) {
        linhasTabela[i].querySelector(".info-valor").textContent = "VALOR INVÁLIDO!";
        linhasTabela[i].classList.add("info-invalida");
    } else {
        // Se quantidade e valor unitário forem válidos, calcular e exibir o total
        linhasTabela[i].querySelector(".info-valor").textContent = formValorMonetario(valoruni);
        linhasTabela[i].querySelector(".info-total").textContent = formValorMonetario(calcularTotal(quantidade, valoruni));
    }
}

// Função para validar a quantidade
function validarQuantidade(quantidade) {
    if (!isNaN(quantidade) && quantidade >= 0) {
        return true;
    } else {
        return false;
    }
}

// Função para validar o valor unitário
function validarValorUnitario(valoruni) {
    if (!isNaN(valoruni) && valoruni >= 0) {
        return true;
    } else {
        return false;
    }
}

// Função para calcular o valor total da encomenda
function calcularTotal(quantidade, valoruni) {
    return quantidade * valoruni;
}

// Função para formatar valores monetários
function formValorMonetario(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

var botaoAdicionar = document.querySelector("#adicionar-encomenda");

botaoAdicionar.addEventListener("click", function(event) {
    event.preventDefault();

    // Obter os valores dos campos do formulário
    var nome = document.querySelector("#nome").value;
    var quantidade = document.querySelector("#quantidade").value;
    var plataforma = document.querySelector("#plat").value;
    var produto = document.querySelector("#produto").value;
    var valor = document.querySelector("#valor").value;

    // Criar uma nova linha na tabela
    var tabela = document.querySelector("table");
    var novaLinha = tabela.insertRow();

    // Adicionar células à nova linha
    var colunaNome = novaLinha.insertCell(0);
    var colunaJogo = novaLinha.insertCell(1);
    var colunaPlataforma = novaLinha.insertCell(2);
    var colunaQuantidade = novaLinha.insertCell(3);
    var colunaPreco = novaLinha.insertCell(4);
    var colunaTotal = novaLinha.insertCell(5);

    if (!validarQuantidade(quantidade)) {
        colunaQuantidade.textContent = "QUANTIDADE INVÁLIDA!";
        colunaQuantidade .style.color = "red";

        // Adiciona todos os outros conteudos
        colunaNome.textContent = nome;
        colunaJogo.textContent = produto;
        colunaPlataforma.textContent = plataforma;
        colunaPreco.textContent = formValorMonetario(parseFloat(valor));
        colunaTotal.textContent = "-"
    } else if (!validarValorUnitario(valor)) {
        colunaPreco.textContent = "VALOR INVÁLIDO!";
        colunaPreco.classList.add("info-invalida");

        // Adiciona todos os outros conteudos
        colunaNome.textContent = nome;
        colunaJogo.textContent = produto;
        colunaPlataforma.textContent = plataforma;
        colunaQuantidade.textContent = quantidade;
        colunaTotal.textContent = formValorMonetario(quantidade * parseFloat(valor));
    } else {
        // Se quantidade e valor unitário forem válidos,
        // Preencher as células com os valores dos campos do formulário
        colunaNome.textContent = nome;
        colunaJogo.textContent = produto;
        colunaPlataforma.textContent = plataforma;
        colunaQuantidade.textContent = quantidade;
        colunaPreco.textContent = formValorMonetario(parseFloat(valor));
        colunaTotal.textContent = formValorMonetario(quantidade * parseFloat(valor));
    }

});
