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

// Lista única de produtos. Toda a loja vai ler daqui.
// O preço é um NÚMERO (89.9), nunca texto, para podermos fazer contas.
const produtos = [
    {
        id: 1,
        nome: "Vaso Sakura",
        categoria: "vasos",
        descricao: "Vaso de cerâmica rosa feito à mão.",
        preco: 89.90,
        imagem: "img/vaso-sakura.svg"
    },
    {
        id: 2,
        nome: "Vaso Pétala",
        categoria: "vasos",
        descricao: "Vaso branco com acabamento fosco.",
        preco: 129.90,
        imagem: "img/vaso-petala.svg"
    },
    {
        id: 3,
        nome: "Prato Ciliegio",
        categoria: "ceramicas",
        descricao: "Prato decorativo pintado à mão.",
        preco: 59.90,
        imagem: "img/prato-ciliegio.svg"
    },
    {
        id: 4,
        nome: "Vela Flor de Cerejeira",
        categoria: "velas",
        descricao: "Vela aromática de cerejeira, 200 g.",
        preco: 39.90,
        imagem: "img/vela-cerejeira.svg"
    }
];

const formularioCheckout = document.getElementById("form-checkout");
const layoutCheckout = document.getElementById("checkout-layout");
const avisoCarrinhoVazio = document.getElementById("aviso-carrinho-vazio");
const avisoProdutoIndisponivel = document.getElementById("aviso-produto-indisponivel");
const resumoItensCheckout = document.getElementById("itens-resumo-checkout");
const totalCheckout = document.getElementById("total-checkout");
const camposCartao = document.getElementById("campos-cartao");
const campoParcelas = document.getElementById("campo-parcelas");
const seletorParcelas = document.getElementById("parcelas");
const previaParcelas = document.getElementById("previa-parcelas");
const confirmacaoPedido = document.getElementById("confirmacao-pedido");
const botaoConfirmarPedido = document.getElementById("confirmar-pedido");

function renderizarResumoCheckout() {
    const carrinho = obterCarrinho();

    if (carrinho.length === 0) {
        layoutCheckout.hidden = true;
        avisoCarrinhoVazio.hidden = false;
        return;
    }

    const possuiProdutoIndisponivel = carrinho.some(function (item) {
        return !produtos.some(function (produto) {
            return produto.id === item.id;
        });
    });

    if (possuiProdutoIndisponivel) {
        layoutCheckout.hidden = true;
        avisoProdutoIndisponivel.hidden = false;
        return;
    }

    let html = "";

    for (const item of carrinho) {
        const produto = produtos.find(function (produtoLoja) {
            return produtoLoja.id === item.id;
        });

        const subtotal = Math.round(produto.preco * 100) * item.quantidade;
        html += `
            <li>
                <span>${produto.nome} × ${item.quantidade}</span>
                <strong>${formatarPreco(subtotal / 100)}</strong>
            </li>
        `;
    }

    resumoItensCheckout.innerHTML = html;
    totalCheckout.textContent = formatarPreco(calcularTotalEmCentavos(carrinho) / 100);
}

function atualizarPreviaParcelas() {
    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');

    if (!pagamentoSelecionado || pagamentoSelecionado.value !== "credito") {
        previaParcelas.textContent = "";
        return;
    }

    const totalEmCentavos = calcularTotalEmCentavos(obterCarrinho());
    const quantidade = Number(seletorParcelas.value);
    const valorBase = Math.floor(totalEmCentavos / quantidade);
    const centavosRestantes = totalEmCentavos % quantidade;

    if (centavosRestantes === 0) {
        previaParcelas.textContent =
            quantidade + "x de " + formatarPreco(valorBase / 100) + " (simulação sem juros).";
        return;
    }

    const ultimaParcela = valorBase + centavosRestantes;
    previaParcelas.textContent =
        (quantidade - 1) + " parcelas de " + formatarPreco(valorBase / 100) +
        " e a última de " + formatarPreco(ultimaParcela / 100) + " (simulação sem juros).";
}

function atualizarFormaPagamento() {
    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
    const usaCartao = pagamentoSelecionado.value === "debito" ||
        pagamentoSelecionado.value === "credito";
    const usaParcelas = pagamentoSelecionado.value === "credito";

    camposCartao.hidden = !usaCartao;
    campoParcelas.hidden = !usaParcelas;

    for (const campo of camposCartao.querySelectorAll("input")) {
        campo.required = usaCartao;
    }

    seletorParcelas.required = usaParcelas;
    atualizarPreviaParcelas();
}

function finalizarPedido() {
    if (!formularioCheckout.reportValidity()) {
        return;
    }

    const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked');
    const nomesPagamento = {
        pix: "PIX",
        debito: "cartão de débito",
        credito: "cartão de crédito"
    };
    const formaPagamento = nomesPagamento[pagamentoSelecionado.value];

    sessionStorage.removeItem(chaveCarrinho);
    formularioCheckout.reset();
    layoutCheckout.hidden = true;
    confirmacaoPedido.hidden = false;
    confirmacaoPedido.innerHTML = `
        <p class="texto-destaque">Pedido concluído</p>
        <h2>Compra simulada com sucesso!</h2>
        <p>Forma escolhida: ${formaPagamento}. Nenhum pagamento real foi realizado.</p>
        <p>Os dados preenchidos não foram enviados nem armazenados.</p>
        <a class="botao" href="index.html">Voltar à loja</a>
    `;
}

for (const opcao of document.querySelectorAll('input[name="pagamento"]')) {
    opcao.addEventListener("change", atualizarFormaPagamento);
}

seletorParcelas.addEventListener("change", atualizarPreviaParcelas);
formularioCheckout.addEventListener("submit", function (evento) {
    evento.preventDefault();
});
botaoConfirmarPedido.addEventListener("click", finalizarPedido);

renderizarResumoCheckout();
atualizarFormaPagamento();


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


const botaoMostrarLogin = document.getElementById("mostrar-login");
const botaoMostrarCadastro = document.getElementById("mostrar-cadastro");
const painelLogin = document.getElementById("painel-login");
const painelCadastro = document.getElementById("painel-cadastro");
const formularioLogin = document.getElementById("form-login");
const formularioCadastro = document.getElementById("form-cadastro");
const mensagemAcesso = document.getElementById("mensagem-acesso");

function mostrarPainelAcesso(painel) {
    const mostrarLogin = painel === "login";

    painelLogin.hidden = !mostrarLogin;
    painelCadastro.hidden = mostrarLogin;
    botaoMostrarLogin.setAttribute("aria-pressed", mostrarLogin);
    botaoMostrarCadastro.setAttribute("aria-pressed", !mostrarLogin);
    mensagemAcesso.textContent = "";
}

function testarCadastro(evento) {
    evento.preventDefault();

    const senha = document.getElementById("senha-cadastro").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
        mensagemAcesso.textContent = "As senhas fictícias não correspondem.";
        return;
    }

    formularioCadastro.reset();
    mensagemAcesso.textContent =
        "Cadastro validado para demonstração. Nenhuma conta foi criada e nenhum dado foi salvo.";
}

function testarLogin(evento) {
    evento.preventDefault();
    formularioLogin.reset();
    mensagemAcesso.textContent =
        "Formulário validado para demonstração. Nenhum login real foi feito ou dado foi salvo.";
}

botaoMostrarLogin.addEventListener("click", function () {
    mostrarPainelAcesso("login");
});

botaoMostrarCadastro.addEventListener("click", function () {
    mostrarPainelAcesso("cadastro");
});

formularioLogin.addEventListener("submit", testarLogin);
formularioCadastro.addEventListener("submit", testarCadastro);
