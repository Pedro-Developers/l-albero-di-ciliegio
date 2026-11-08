// Muda a quantidade de um produto (delta = +1 ou -1). Se chegar a 0, remove.
function alterarQuantidade(id, delta) {
  let carrinho = pegarCarrinho();
  const item = carrinho.find(function (i) { return i.id === id; });
  item.qtd += delta;
  if (item.qtd <= 0) { carrinho = carrinho.filter(function (i) { return i.id !== id; }); }
  salvarCarrinho(carrinho);
  mostrarCarrinho();
}
function removerProduto(id) {
  salvarCarrinho(pegarCarrinho().filter(function (i) { return i.id !== id; }));
  mostrarCarrinho();
}

// Desenha o carrinho na tela (chamada de novo sempre que algo muda)
function mostrarCarrinho() {
  const caixa = document.getElementById('carrinho');
  const itens = pegarCarrinho();
  if (itens.length === 0) {
    caixa.innerHTML = '<p>Seu carrinho está vazio.</p><br><a class="btn btn-primario" href="produtos.html">Continuar comprando</a>';
    return;
  }
  let html = '';
  itens.forEach(function (i) {
    const p = buscarProduto(i.id);
    html += `<div class="linha-carrinho">
      <img src="${raiz}${p.img}" alt="${p.nome}">
      <div><h3>${p.nome}</h3><small>${formatarPreco(p.preco)} cada</small></div>
      <div class="qtd"><button data-menos="${p.id}">−</button><span>${i.qtd}</span><button data-mais="${p.id}">+</button></div>
      <strong>${formatarPreco(p.preco * i.qtd)}</strong>
      <button class="remover" data-remover="${p.id}" title="Remover">✕</button></div>`;
  });
  const subtotal = totalCarrinho();
  const desconto = pegarDesconto(subtotal);
  const frete = calcularFrete(subtotal);
  html += `<div class="resumo">
    <div class="cupom"><input id="cupom" placeholder="Cupom (BEMVINDO10)"><button class="btn btn-secundario" onclick="usarCupom()">Aplicar</button></div>
    <p>Subtotal <span>${formatarPreco(subtotal)}</span></p>
    ${desconto > 0 ? `<p>Cupom BEMVINDO10 (−10%) <span>−${formatarPreco(desconto)}</span></p>` : ''}
    <p>Frete <span>${frete === 0 ? 'Grátis' : formatarPreco(frete)}</span></p>
    <p class="total">Total <span>${formatarPreco(subtotal - desconto + frete)}</span></p>
    <a class="btn btn-secundario" href="produtos.html">Continuar comprando</a>
    <a class="btn btn-primario" href="checkout.html">Ir para checkout</a></div>`;
  caixa.innerHTML = html;
}

function usarCupom() {
  if (aplicarCupom(document.getElementById('cupom').value)) { mostrarCarrinho(); }
  else { mostrarAviso('Cupom inválido.'); }
}

function iniciarCarrinho() {
  mostrarCarrinho();
  // Um único "ouvinte" para os botões +, − e ✕ (que são recriados a cada desenho)
  document.getElementById('carrinho').addEventListener('click', function (e) {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.mais) alterarQuantidade(Number(b.dataset.mais), 1);
    if (b.dataset.menos) alterarQuantidade(Number(b.dataset.menos), -1);
    if (b.dataset.remover) removerProduto(Number(b.dataset.remover));
  });
}