document.addEventListener("DOMContentLoaded", carregarSalgados);

var salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados'));

//Função para carregar automaticamente todos os salgados do banco de dados
function carregarSalgados() {
    fetch('http://localhost:8080/api/salgados')
        .then(response => response.json())
        .then(salgados => {
            const cardapio = document.getElementById("cardapio");
            cardapio.innerHTML = ""; // Limpa o conteúdo existente

            salgados.forEach(salgado => {
                const card = document.createElement("div");
                card.classList.add("col-md-4");
                card.setAttribute("data-tipo", salgado.classe); // Adiciona o atributo data-tipo para o filtro

                card.innerHTML = `
                    <div class="card">
                        <img src="${salgado.urlFoto}" class="card-img-top" alt="${salgado.nome}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${salgado.nome.toUpperCase()}</h5>
                            <h5 class="card-title"><span class="preco">R$ ${salgado.preco}</span></h5>
                        </div>
                    </div>
                `;

                cardapio.appendChild(card);
            });

            // Ativa o filtro após carregar os salgados
            ativarFiltro();
            editarCard();
        })
        .catch(error => console.error("Erro ao carregar os salgados:", error));
}

//Função pra ativar Filtro
function ativarFiltro() {
    const filtros = document.querySelector('.btn-group');
    const cardapio = document.getElementById("cardapio");

    filtros.addEventListener('click', function (e) {
        const input = e.target.closest('input[type="radio"]'); // Verifica se o clique foi em um <input>
        if (!input) return; // Sai se o clique não foi em um <input>

        const tipo = input.value; // Obtém o valor do botão de rádio selecionado
        const items = cardapio.querySelectorAll('.col-md-4'); // Seleciona os itens no cardápio

        items.forEach(item => {
            if (tipo === 'todos') {
                item.style.display = ''; // Exibe todos os itens
            } else {
                item.style.display = item.getAttribute('data-tipo') === tipo ? '' : 'none'; // Filtra pelo tipo
            }
        });
    });
}

//Função pra editar card
function editarCard() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function (event) {
            const img = event.target.closest('.card').querySelector('img');
            const nome = event.target.closest('.card').querySelector('h5');
            const preco = event.target.closest('.card').querySelector('.preco');
            var tipo_marcado = card.closest('.col-md-4').getAttribute('data-tipo');
            
            document.querySelector('.produto-editar-background').style.display = 'block';
            document.querySelector('.produto-editar .nome-item').value = nome.textContent;
            document.querySelector('.produto-editar .preco-item').value = preco.textContent;
            document.querySelector(`.produto-editar .${tipo_marcado}`).checked = true;
            document.querySelector('.produto-editar .img-item').src = img.getAttribute('src');

            const nome_original = document.querySelector(".nome_original");
            nome_original.textContent = nome.textContent;

            const cabecalho = document.getElementById("cabecalho");
            cabecalho.className = "navbar bg-body-tertiary";

        });
    })
}

// Função para redirecionar para outra página
function redirecionar(pagina) {
    window.location.href = pagina;
}

// Função para abrir as pop-ups
function openPopup(type) {
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary";
    document.querySelector(`.${type}-background`).style.display = 'block';
}

// Função para fechar as pop-ups
function closePopup(type) {
    document.querySelector(`.${type}-background`).style.display = 'none';
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}

//Função para adicionar novo produto
function adicionarNovoProduto() {
    const nome = document.getElementById("nome_produto").value;
    const preco = document.getElementById("preco_produto").value;

    const radios = document.querySelectorAll('input[name="opcao2"]');
    let categoria = null;

    for (const radio of radios) {
        if (radio.checked) {
            categoria = radio.value;
            break;
        }
    }

    const imagemProduto = document.getElementById("imagem_produto").files[0];

    // Verificar se os campos obrigatórios estão preenchidos
    if (!nome || !preco || !categoria) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("preco", preco);
    formData.append("categoria", categoria);
    formData.append("urlImg", null);
    formData.append("imagem", imagemProduto);

    fetch("http://localhost:8080/api/adicionar-salgado", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Salgado adicionado com sucesso!");
                carregarSalgados();
            } else {
                alert("Erro: " + data.error);
            }
        })
        .catch(error => console.error("Erro:", error));
}

//Função para remover produto
function removerProduto() {
    // Recebe o nome do produto digitado pelo usuário
    const produtoNome = document.getElementById('produto-remover').value.trim().toLowerCase();

    // Verifica se o campo de produto não está vazio
    if (produtoNome === '') {
        alert('Por favor, digite o nome do produto.');
        return;
    }

    // Envia a requisição DELETE para remover o produto
    fetch(`http://localhost:8080/api/remover-salgado?nome=${encodeURIComponent(produtoNome)}`, {
        method: "DELETE",
    })
        .then(response => response.json())
        .then(data => {
            // Verifica se o produto foi removido com sucesso
            if (data.success) {
                alert('Produto removido com sucesso!');
                carregarSalgados();  // Atualiza a lista de salgados
            } else {
                alert('Erro: ' + data.error);
            }
        })
        .catch(error => console.error('Erro:', error));

    // Limpa o campo de texto após a remoção
    document.getElementById('produto-remover').value = '';

    // Fecha a área de remoção (por exemplo, escondendo um modal)
    document.querySelector('.remover-item-background').style.display = 'none';
}

//Função para editar um produto
function editarProduto() {
    const produtoNomeOriginal = document.querySelector('.produto-editar .nome_original').textContent;
    let novoNome = document.querySelector('.produto-editar .nome-item').value;
    let preco = document.querySelector('.produto-editar .preco-item').value;
    let novoPreco = preco.replace("R$ ", "");

    const radios = document.querySelectorAll('input[name="opcao"]');
    let valorSelecionado;

    for (const radio of radios) {
        if (radio.checked) {
            valorSelecionado = radio.value;
            break;
        }
    }

    const imagemProduto = document.getElementById("nova_imagem").files[0];
    let imagemURL = document.querySelector('.produto-editar img').src;

    // Primeiro, remover o produto original
    fetch("http://localhost:8080/api/remover-salgado?nome=" + produtoNomeOriginal, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Produto removido com sucesso, agora podemos adicionar o novo produto
            const formData = new FormData();
            formData.append("nome", novoNome);
            formData.append("preco", novoPreco);
            formData.append("categoria", valorSelecionado);
            formData.append("urlImg", imagemURL);
            if (imagemProduto) {
                formData.append("imagem", imagemProduto);  // Envia a nova imagem, se selecionada
            }

            fetch("http://localhost:8080/api/adicionar-salgado", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Salgado adicionado com sucesso!");
                    carregarSalgados();
                } else {
                    alert("Erro: " + data.error);
                }
            })
            .catch(error => console.error("Erro ao adicionar o novo produto:", error));
        } else {
            alert("Erro ao remover o produto original: " + data.error);
        }
    })
    .catch(error => console.error("Erro ao remover o produto:", error));
}

