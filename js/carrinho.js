const chaveCarrinho = "albero-di-ciliegio-carrinho";

function obterCarrinho() {
    const dadosSalvos = sessionStorage.getItem(chaveCarrinho);
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
}

function salvarCarrinho(carrinho) {
    sessionStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
}

function calcularTotalEmCentavos(carrinho) {
    let total = 0;

    for (const item of carrinho) {
        const produto = produtos.find(function (produtoLoja) {
            return produtoLoja.id === item.id;
        });

        if (produto) {
            total += Math.round(produto.preco * 100) * item.quantidade;
        }
    }

    return total;
}

function adicionarAoCarrinho(idProduto) {
    const carrinho = obterCarrinho();
    const itemExistente = carrinho.find(function (item) {
        return item.id === idProduto;
    });

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ id: idProduto, quantidade: 1 });
    }

    salvarCarrinho(carrinho);
}

function alterarQuantidade(idProduto, diferenca) {
    const carrinho = obterCarrinho();
    const item = carrinho.find(function (produto) {
        return produto.id === idProduto;
    });

    if (!item) {
        return;
    }

    item.quantidade = Math.max(1, item.quantidade + diferenca);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function removerDoCarrinho(idProduto) {
    const carrinho = obterCarrinho();
    const carrinhoAtualizado = carrinho.filter(function (item) {
        return item.id !== idProduto;
    });

    salvarCarrinho(carrinhoAtualizado);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");

    if (!lista) {
        return;
    }

    const carrinho = obterCarrinho();
    const totalElemento = document.getElementById("total-carrinho");
    const mensagemCarrinho = document.getElementById("mensagem-carrinho");
    const linkCheckout = document.getElementById("checkout-link");

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        totalElemento.textContent = formatarPreco(0);
        mensagemCarrinho.textContent = "";
        linkCheckout.hidden = true;
        return;
    }

    let html = "";
    let quantidadeDisponivel = 0;
    let possuiProdutoIndisponivel = false;

    for (const item of carrinho) {
        const produto = produtos.find(function (produtoLoja) {
            return produtoLoja.id === item.id;
        });

        if (!produto) {
            possuiProdutoIndisponivel = true;
            html += `
                <article class="item-carrinho">
                    <p>Um produto salvo não está mais disponível.</p>
                    <button class="botao-remover" type="button"
                            data-acao="remover" data-id="${item.id}">
                        Remover item
                    </button>
                </article>
            `;
            continue;
        }

        const subtotalEmCentavos = Math.round(produto.preco * 100) * item.quantidade;
        quantidadeDisponivel += 1;

        html += `
            <article class="item-carrinho">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="item-carrinho-info">
                    <h2>${produto.nome}</h2>
                    <p>${formatarPreco(produto.preco)} cada</p>
                </div>
                <div class="controles-quantidade" aria-label="Quantidade">
                    <button class="botao-quantidade" type="button"
                            data-acao="diminuir" data-id="${produto.id}"
                            aria-label="Diminuir quantidade de ${produto.nome}">−</button>
                    <span>${item.quantidade}</span>
                    <button class="botao-quantidade" type="button"
                            data-acao="aumentar" data-id="${produto.id}"
                            aria-label="Aumentar quantidade de ${produto.nome}">+</button>
                </div>
                <p class="subtotal-item">Subtotal: ${formatarPreco(subtotalEmCentavos / 100)}</p>
                <button class="botao-remover" type="button"
                        data-acao="remover" data-id="${produto.id}">
                    Remover
                </button>
            </article>
        `;
    }

    lista.innerHTML = html;
    if (possuiProdutoIndisponivel) {
        totalElemento.textContent = "Revise os itens";
        mensagemCarrinho.textContent =
            "Remova os produtos indisponíveis antes de continuar para a finalização.";
    } else {
        totalElemento.textContent = formatarPreco(calcularTotalEmCentavos(carrinho) / 100);
        mensagemCarrinho.textContent = "";
    }
    linkCheckout.hidden = quantidadeDisponivel === 0 || possuiProdutoIndisponivel;
}

function configurarAdicionarAoCarrinho() {
    const botao = document.getElementById("adicionar-carrinho");
    const mensagem = document.getElementById("mensagem-adicionar");

    if (!botao || !mensagem) {
        return;
    }

    botao.addEventListener("click", function () {
        const idProduto = Number(botao.dataset.id);
        const produto = produtos.find(function (item) {
            return item.id === idProduto;
        });

        if (!produto) {
            mensagem.textContent = "Não foi possível encontrar este produto.";
            return;
        }

        adicionarAoCarrinho(idProduto);
        mensagem.textContent = produto.nome + " foi adicionado ao carrinho.";
    });
}

function configurarAcoesCarrinho() {
    const lista = document.getElementById("lista-carrinho");

    if (!lista) {
        return;
    }

    lista.addEventListener("click", function (evento) {
        const botao = evento.target.closest("button[data-acao]");

        if (!botao) {
            return;
        }

        const idProduto = Number(botao.dataset.id);

        if (botao.dataset.acao === "aumentar") {
            alterarQuantidade(idProduto, 1);
        } else if (botao.dataset.acao === "diminuir") {
            alterarQuantidade(idProduto, -1);
        } else if (botao.dataset.acao === "remover") {
            removerDoCarrinho(idProduto);
        }
    });
}

configurarAdicionarAoCarrinho();
configurarAcoesCarrinho();
renderizarCarrinho();
