document.addEventListener("DOMContentLoaded", carregarNovosPedidos);

//Função para carregar automaticamente todos os novos pedidos do banco de dados
function carregarNovosPedidos() {
    fetch('http://localhost:8080/api/novos-pedidos')
        .then(response => response.json())
        .then(pedidos => {
            const main = document.getElementById("novosPedidos");
            main.innerHTML = "<h1>Novos Pedidos:</h1>"; // Limpa o conteúdo existente

            pedidos.forEach(pedido => {
                const div = document.createElement("div");
                div.classList.add("pedido");

                div.innerHTML = `
                    <div class="info">
                        <span>Pedido de ${pedido.nome}</span>
                    </div>
                    <div class="detalhes">
                        <span class="dh">Data: ${formatarData(pedido.dataHoraPedido)}<br>
                            Horário: ${formatarHora(pedido.dataHoraPedido)} </span>
                        <button onclick="redirecionar('confirmarpedido.html', ${pedido.id})">Ver Detalhes</button> 
                    </div>
                `;

                main.appendChild(div);
            });
        })
        .catch(error => console.error("Erro ao carregar os salgados:", error));
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

// Função para abrir as pop-ups
function openPopup(type) {
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary";
    document.querySelector(`.${type}-background`).style.display = 'block';
}

//Função para exibir a pop-up correta
function exibirPopUpPagamento() {
    if (document.getElementById("dinheiro").checked) {
        openPopup('dinheiro');
    } else if (document.getElementById("cartao").checked) {
        openPopup('cartao');
    } else if (document.getElementById("pix").checked) {
        openPopup('pix');
    }
}

// Função para fechar as pop-ups
function closePopup(type) {
    document.querySelector(`.${type}-background`).style.display = 'none';
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}

// Função para finalizar o pedido
function finalizarPedido(type) {
    document.querySelector(`.agradecimento-background`).style.display = 'block';
    document.querySelector(`.${type}-background`).style.display = 'none';

    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary";
}

function alerta(type) {
    alert(`${type}`);
}