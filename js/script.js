function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function criarCardProduto(produto) {
    return `
        <article class="produto">
            <img class="produto-imagem" src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <span class="produto-preco">${formatarPreco(produto.preco)}</span>
                <a class="botao botao-detalhes" href="produto.html?id=${produto.id}">Ver detalhes</a>
            </div>
        </article>
    `;
}

const categorias = [
    { id: "vasos", nome: "Vasos" },
    { id: "ceramicas", nome: "Cerâmicas" },
    { id: "velas", nome: "Velas" }
];

function mostrarProdutos() {
    const lista = document.getElementById("lista-produtos");

    if (!lista) {
        return;
    }

    let html = "";

    for (const produto of produtos) {
        html += criarCardProduto(produto);
    }

    lista.innerHTML = html;
}

function mostrarCatalogo() {
    const catalogo = document.getElementById("lista-catalogo");

    if (!catalogo) {
        return;
    }

    let html = "";

    for (const categoria of categorias) {
        const produtosDaCategoria = produtos.filter(function (produto) {
            return produto.categoria === categoria.id;
        });

        if (produtosDaCategoria.length === 0) {
            continue;
        }

        html += `
            <section class="catalogo-categoria" id="${categoria.id}">
                <h2>${categoria.nome}</h2>
                <div class="grade grade-4">
        `;

        for (const produto of produtosDaCategoria) {
            html += criarCardProduto(produto);
        }

        html += `
                </div>
            </section>
        `;
    }

    catalogo.innerHTML = html;
}

function mostrarDetalheProduto() {
    const detalhe = document.getElementById("detalhe-produto");
    const mensagem = document.getElementById("mensagem-produto");

    if (!detalhe || !mensagem) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));
    const produto = produtos.find(function (item) {
        return item.id === id;
    });

    if (!produto) {
        mensagem.textContent = "Produto não encontrado. Volte ao catálogo para escolher outro item.";
        return;
    }

    const categoria = categorias.find(function (item) {
        return item.id === produto.categoria;
    });

    if (!categoria) {
        mensagem.textContent = "A categoria deste produto não está cadastrada.";
        return;
    }

    detalhe.innerHTML = `
        <div class="detalhe-imagem-fundo">
            <img class="detalhe-imagem" src="${produto.imagem}" alt="${produto.nome}">
        </div>
        <div class="detalhe-info">
            <p class="texto-destaque">${categoria.nome}</p>
            <h1>${produto.nome}</h1>
            <p>${produto.descricao}</p>
            <p class="produto-preco">${formatarPreco(produto.preco)}</p>
            <button id="adicionar-carrinho" class="botao" type="button" data-id="${produto.id}">
                Adicionar ao carrinho
            </button>
            <p id="mensagem-adicionar" class="mensagem-carrinho" role="status"></p>
            <a class="botao" href="produtos.html">Voltar ao catálogo</a>
        </div>
    `;
}

function configurarMenu() {
    const botao = document.getElementById("botao-menu");
    const menu = document.getElementById("menu");

    if (!botao || !menu) {
        return;
    }

    botao.addEventListener("click", function () {
        const menuAberto = menu.classList.toggle("aberto");
        botao.setAttribute("aria-expanded", menuAberto);
        botao.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
    });

    menu.addEventListener("click", function (evento) {
        if (evento.target.closest("a")) {
            menu.classList.remove("aberto");
            botao.setAttribute("aria-expanded", "false");
            botao.setAttribute("aria-label", "Abrir menu");
        }
    });
}

mostrarProdutos();
mostrarCatalogo();
mostrarDetalheProduto();
configurarMenu();
