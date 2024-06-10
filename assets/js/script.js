document.addEventListener("DOMContentLoaded", function() {
    var titulo = document.querySelector(".tit-enc");
    titulo.textContent = "Lista de Encomendas";

    function validarQuantidade(quantidade) {
        return !isNaN(quantidade) && quantidade > 0;
    }

    function validarValorUnitario(valoruni) {
        return !isNaN(valoruni) && valoruni > 0;
    }

    function calcularTotal(quantidade, valoruni) {
        return quantidade * valoruni;
    }

    function formValorMonetario(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    async function fetchWithRetry(url, options, retries = 5, delay = 5000) {
        for (let i = 0; i <= retries; i++) {
            const response = await fetch(url, options);
            if (response.status !== 429) {
                return response;
            }
            if (i < retries) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                throw new Error('Too Many Requests: Max retries reached');
            }
        }
    }

    async function buscarIdJogo(jogo) {
        console.log(`Buscando ID do jogo: ${jogo}`);
        const url = `https://opencritic-api.p.rapidapi.com/game/search?criteria=${encodeURIComponent(jogo)}`;
        
        try {
            const response = await fetchWithRetry(url, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '783e3cb894msh53838350e61e49dp129517jsn8d1f40670c35',
                    'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro na resposta da API ao buscar ID: ${response.status}`);
            }
            const data = await response.json();
            console.log(`Dados recebidos da API OpenCritic para o jogo ${jogo}:`, data);

            if (data && data.length > 0) {
                return data[0].id;
            } else {
                throw new Error('Jogo não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar ID do jogo no OpenCritic:', error);
            return null;
        }
    }

    async function buscarNotaOpenCritic(jogo) {
        const jogoId = await buscarIdJogo(jogo);
        if (!jogoId) {
            return "N/A";
        }

        console.log(`Buscando nota do OpenCritic para o jogo ID: ${jogoId}`);
        const url = `https://opencritic-api.p.rapidapi.com/game/${jogoId}`;
        
        try {
            const response = await fetchWithRetry(url, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '783e3cb894msh53838350e61e49dp129517jsn8d1f40670c35',
                    'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro na resposta da API ao buscar nota: ${response.status}`);
            }
            const data = await response.json();
            console.log(`Dados recebidos da API OpenCritic para o jogo ID ${jogoId}:`, data);

            return data.topCriticScore !== undefined ? data.topCriticScore : "N/A";
        } catch (error) {
            console.error('Erro ao buscar nota do OpenCritic:', error);
            return "N/A";
        }
    }

    var botaoAdicionar = document.querySelector("#adicionar-encomenda");

    botaoAdicionar.addEventListener("click", async function(event) {
        event.preventDefault();

        var errorList = document.getElementById("error-list");
        errorList.innerHTML = "";

        var nome = document.querySelector("#nome").value;
        var quantidadeInput = document.querySelector("#quantidade");
        var quantidade = parseInt(quantidadeInput.value);
        var plataforma = document.querySelector("#plat").value;
        var produto = document.querySelector("#produto").value;
        var valorInput = document.querySelector("#valor");
        var valor = parseFloat(valorInput.value.replace(',', '.'));

        function adicionarErro(mensagem) {
            var listItem = document.createElement("li");
            listItem.textContent = mensagem;
            listItem.classList.add("error-message");
            errorList.appendChild(listItem);
        }

        if (nome === "") {
            adicionarErro("Por favor, preencha o nome.");
        }
        if (isNaN(quantidade) || quantidade <= 0) {
            adicionarErro("A quantidade deve ser um número maior que zero.");
        }
        if (plataforma === "") {
            adicionarErro("Por favor, selecione a plataforma.");
        }
        if (produto === "") {
            adicionarErro("Por favor, selecione o produto.");
        }
        if (isNaN(valor) || valor <= 0) {
            adicionarErro("O valor unitário deve ser um número maior que zero.");
        }

        if (errorList.children.length > 0) {
            return;
        }

        var tabela = document.querySelector("#tabela-encomendas");
        var novaLinha = tabela.insertRow();
        novaLinha.classList.add("linhas");

        var colunaNome = novaLinha.insertCell(0);
        colunaNome.classList.add("info-nome");
        var colunaJogo = novaLinha.insertCell(1);
        colunaJogo.classList.add("info-jogo");
        var colunaPlataforma = novaLinha.insertCell(2);
        colunaPlataforma.classList.add("info-plataforma");
        var colunaQuantidade = novaLinha.insertCell(3);
        colunaQuantidade.classList.add("info-qtd");
        var colunaPreco = novaLinha.insertCell(4);
        colunaPreco.classList.add("info-valor");
        var colunaTotal = novaLinha.insertCell(5);
        colunaTotal.classList.add("info-total");
        var colunaNota = novaLinha.insertCell(6); // Nova coluna para nota OpenCritic
        colunaNota.classList.add("info-nota");

        colunaNome.textContent = nome;
        colunaJogo.textContent = produto;
        colunaPlataforma.textContent = plataforma;
        colunaQuantidade.textContent = quantidade;
        colunaPreco.textContent = formValorMonetario(valor);
        colunaTotal.textContent = formValorMonetario(calcularTotal(quantidade, valor));

        var notaOpenCritic = await buscarNotaOpenCritic(produto);
        colunaNota.textContent = typeof notaOpenCritic === "number" ? notaOpenCritic.toFixed(2) : notaOpenCritic;

        document.getElementById("nome").value = "";
        quantidadeInput.value = "";
        document.getElementById("plat").value = "";
        document.getElementById("produto").value = "";
        valorInput.value = "";

        novaLinha.addEventListener("dblclick", function() {
            this.remove();
        });
    });
});
