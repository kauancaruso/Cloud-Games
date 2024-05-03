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

    // Limpa a lista de erros antes de adicionar novos erros
    var errorList = document.getElementById("error-list");
    errorList.innerHTML = "";

    // Obter os valores dos campos do formulário
    var nome = document.querySelector("#nome").value;
    var quantidadeInput = document.querySelector("#quantidade");
    var quantidade = quantidadeInput.value;
    var plataforma = document.querySelector("#plat").value;
    var produto = document.querySelector("#produto").value;
    var valorInput = document.querySelector("#valor");
    var valor = valorInput.value;

    // Função para adicionar um erro à lista de erros
    function adicionarErro(mensagem) {
        var listItem = document.createElement("li");
        listItem.textContent = mensagem;
        listItem.classList.add("error-message"); // Adiciona a classe de erro
        errorList.appendChild(listItem);
    }

    // Lógica de validação para os campos do formulário
    if (nome === "") {
        adicionarErro("Por favor, preencha o nome.");
    }
    if (quantidade === "") {
        adicionarErro("Por favor, preencha a quantidade.");
    } else if (isNaN(quantidade) || parseInt(quantidade) <= 0) {
        adicionarErro("A quantidade deve ser um número maior que zero.");
    }
    if (plataforma === "") {
        adicionarErro("Por favor, selecione a plataforma.");
    }
    if (produto === "") {
        adicionarErro("Por favor, selecione o produto.");
    }
    if (valor === "") {
        adicionarErro("Por favor, preencha o valor unitário.");
    } else if (isNaN(valor) || parseFloat(valor) <= 0 || !/\./.test(valor)) {
        adicionarErro("O valor unitário deve ser um número maior que zero e conter '.' no lugar da ','");
    }

    // Se houver erros, sai da função
    if (errorList.children.length > 0) {
        return;
    }

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

    // Preencher as células com os valores dos campos do formulário
    colunaNome.textContent = nome;
    colunaJogo.textContent = produto;
    colunaPlataforma.textContent = plataforma;
    colunaQuantidade.textContent = quantidade;
    colunaPreco.textContent = formValorMonetario(parseFloat(valor));
    colunaTotal.textContent = formValorMonetario(quantidade * parseFloat(valor));

    // Limpar os campos do formulário após a adição à tabela
    document.getElementById("nome").value = "";
    quantidadeInput.value = "";
    document.getElementById("plat").value = "";
    document.getElementById("produto").value = "";
    valorInput.value = "";
});

// Adicionando evento de duplo clique para excluir linhas da tabela
var linhasTabela = document.querySelectorAll(".linhas");
linhasTabela.forEach(function(linha) {
    linha.addEventListener("dblclick", function() {
        this.remove();
    });
});
