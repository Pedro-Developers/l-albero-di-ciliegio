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
