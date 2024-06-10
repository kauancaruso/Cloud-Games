document.addEventListener("DOMContentLoaded", function() {
    var botaoBuscar = document.querySelector("#buscar-encomendas");

    botaoBuscar.addEventListener("click", function() {
        fetch('http://localhost:3001/encomendas_web')
            .then(response => response.json())
            .then(data => atualizarTabela(data))
            .catch(error => console.error('Erro ao buscar encomendas:', error));
    });

    async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
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

    async function buscarIdJogo(nomeJogo) {
        const url = `https://opencritic-api.p.rapidapi.com/game/search?criteria=${encodeURIComponent(nomeJogo)}`;
        console.log(`Fetching game ID from URL: ${url}`);
        
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
            console.log(`API Response for game ID:`, data);

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

    async function buscarNotaOpenCritic(idJogo) {
        const url = `https://opencritic-api.p.rapidapi.com/game/${idJogo}`;
        console.log(`Fetching game score from URL: ${url}`);
        
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
            console.log(`API Response for game score:`, data);

            return data.topCriticScore !== undefined ? data.topCriticScore : "N/A";
        } catch (error) {
            console.error('Erro ao buscar nota do OpenCritic:', error);
            return "N/A";
        }
    }

    async function atualizarTabela(encomendas) {
        var tabela = document.querySelector("table");
        tabela.querySelectorAll("tr:not(:first-child)").forEach(linha => linha.remove());

        for (const encomenda of encomendas) {
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
            var colunaNota = novaLinha.insertCell(6);
            colunaNota.classList.add("info-nota");

            colunaNome.textContent = encomenda.nome;
            colunaJogo.textContent = encomenda.produto;
            colunaPlataforma.textContent = encomenda.plat;
            colunaQuantidade.textContent = encomenda.quantidade ?? "N/A";
            colunaPreco.textContent = encomenda.valor ? formValorMonetario(parseFloat(encomenda.valor)) : "N/A";

            var quantidade = parseFloat(encomenda.quantidade);
            var valor = parseFloat(encomenda.valor);

            if (!isNaN(quantidade) && !isNaN(valor)) {
                var total = quantidade * valor;
                colunaTotal.textContent = formValorMonetario(total);
            } else {
                colunaTotal.textContent = "N/A";
            }

            try {
                var idJogo = await buscarIdJogo(encomenda.produto);
                if (idJogo) {
                    var nota = await buscarNotaOpenCritic(idJogo);
                    if (typeof nota === "number") {
                        colunaNota.textContent = nota.toFixed(2);
                    } else {
                        colunaNota.textContent = nota;
                    }
                } else {
                    colunaNota.textContent = "N/A";
                }
            } catch (error) {
                colunaNota.textContent = "Erro";
                console.error('Erro ao buscar nota do OpenCritic:', error);
            }

            novaLinha.addEventListener("dblclick", function() {
                this.remove();
            });
        }
    }

    function formValorMonetario(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
});
