document.addEventListener("DOMContentLoaded", carregarPedidosAceitos);

//Função para carregar automaticamente todos os novos pedidos do banco de dados
function carregarPedidosAceitos() {
    fetch('http://localhost:8080/api/pedidos-aceitos')
        .then(response => response.json())
        .then(pedidos => {
            const div = document.getElementById("todosPedidos");
            div.innerHTML = ""; // Limpa o conteúdo existente

            pedidos.forEach(pedido => {
                const divFilha = document.createElement("div");
                divFilha.classList.add("pedido");

                divFilha.innerHTML = `
                    <div class="info">
                        <span>Pedido de ${pedido.nome}</span>
                    </div>
                    <div class="detalhes">
                        <span class="dh">Data: ${formatarData(pedido.dataHoraPedido)}<br>
                            Horário: ${formatarHora(pedido.dataHoraPedido)} </span>
                        <button onclick="redirecionar('encerrarpedido.html', ${pedido.id})">Ver Detalhes</button> 
                    </div>
                `;

                div.appendChild(divFilha);
            });
        })
        .catch(error => console.error("Erro ao carregar os pedidos:", error));
}

//Função para carregar pedidos por data
function carregarPedidosPorData() {
    const dataSelecionada = document.getElementById("hora_retirada").value;

    if (!dataSelecionada) {
        alert("Por favor, selecione uma data para filtrar os pedidos.");
        return;
    }

    fetch(`http://localhost:8080/api/pedidos-por-data?data=${dataSelecionada}`)
        .then(response => response.json())
        .then(pedidos => {
            const div = document.getElementById("todosPedidos");
            div.innerHTML = ""; // Limpa o conteúdo existente

            if (pedidos.length === 0) {
                div.innerHTML = "<p>Nenhum pedido encontrado para a data selecionada.</p>";
                return;
            }

            pedidos.forEach(pedido => {
                const divFilha = document.createElement("div");
                divFilha.classList.add("pedido");

                divFilha.innerHTML = `
                    <div class="info">
                        <span>Pedido de ${pedido.nome}</span>
                    </div>
                    <div class="detalhes">
                        <span class="dh">Data: ${formatarData(pedido.dataHoraPedido)}<br>
                            Horário: ${formatarHora(pedido.dataHoraPedido)} </span>
                        <button onclick="redirecionar('encerrarpedido.html', ${pedido.id})">Ver Detalhes</button> 
                    </div>
                `;

                div.appendChild(divFilha);
            });
        })
        .catch(error => console.error("Erro ao carregar os pedidos:", error));
}

// Função para formatar apenas a data
function formatarData(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR'); // Formato: dd/mm/aaaa
}

// Função para formatar apenas o horário
function formatarHora(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Formato: hh:mm
}

// Função para redirecionar com o ID do pedido na URL
function redirecionar(pagina, id) {
    window.location.href = `${pagina}?id=${id}`;
}

function toggleSection(sectionId, button) {
    const section = document.getElementById(sectionId);
    const icon = button.querySelector(".toggle-icon");

    // Alternar visibilidade
    if (section.classList.contains('hidden')) {
        section.classList.remove('hidden');
        icon.innerHTML = "&#9650;"; // Seta para cima
    } else {
        section.classList.add('hidden');
        icon.innerHTML = "&#9660;"; // Seta para baixo
    }
}