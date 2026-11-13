function mostrarCamposPagamento() {
  const forma = document.querySelector('input[name="pagamento"]:checked').value;
  const usaCartao = forma === 'debito' || forma === 'credito';
  document.getElementById('campos-cartao').hidden = !usaCartao;
  document.getElementById('campo-parcelas').hidden = forma !== 'credito';
  document.getElementById('caixa-pix').hidden = forma !== 'pix';
  document.getElementById('caixa-boleto').hidden = forma !== 'boleto';
  document.querySelectorAll('#campos-cartao input').forEach(function (campo) { campo.required = usaCartao; });
}

function finalizarPedido(total) {
  const f = document.getElementById('formulario');
  const forma = f.pagamento.value;
  if (forma === 'debito' || forma === 'credito') {
    if (!/^\d{16}$/.test(f.numero.value.replace(/\s/g, ''))) return alert('O número fictício precisa ter 16 dígitos.');
    if (!/^\d{3}$/.test(f.cvv.value)) return alert('O CVV fictício precisa ter 3 dígitos.');
  }
  const pedido = {
    numero: Math.floor(100000 + Math.random() * 900000),
    nome: f.nome.value,
    total: total,
    pagamento: forma,
    parcelas: forma === 'credito' ? Number(f.parcelas.value) : 1
  };
  localStorage.setItem('pedido', JSON.stringify(pedido));
  localStorage.removeItem('carrinho'); 
  localStorage.removeItem('cupom');
  location.href = 'sucesso.html';
}

function iniciarCheckout() {
  const itens = pegarCarrinho();
  if (itens.length === 0) { location.href = 'compra.html'; return; }
  const subtotal = totalCarrinho();
  const frete = calcularFrete(subtotal);
  const desconto = pegarDesconto(subtotal);
  const total = subtotal - desconto + frete;

  let resumo = '<h3>Resumo do pedido</h3>';
  itens.forEach(function (i) {
    const p = buscarProduto(i.id);
    resumo += `<p>${i.qtd}x ${p.nome} <span>${formatarPreco(p.preco * i.qtd)}</span></p>`;
  });
  if (desconto > 0) resumo += `<p>Cupom BEMVINDO10 <span>−${formatarPreco(desconto)}</span></p>`;
  resumo += `<p>Frete <span>${frete === 0 ? 'Grátis' : formatarPreco(frete)}</span></p><p class="total">Total <span>${formatarPreco(total)}</span></p>`;
  document.getElementById('resumo').innerHTML = resumo;

  
  let opcoes = '';
  for (let n = 1; n <= 6; n++) {
    opcoes += `<option value="${n}">${n}x de ${formatarPreco(Math.round(total / n))} sem juros</option>`;
  }
  document.getElementById('parcelas').innerHTML = opcoes;

  document.querySelectorAll('input[name="pagamento"]').forEach(function (r) {
    r.addEventListener('change', mostrarCamposPagamento);
  });
  mostrarCamposPagamento();
  document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault(); 
    finalizarPedido(total);
  });
}

function mostrarSucesso() {
  const pedido = JSON.parse(localStorage.getItem('pedido'));
  const caixa = document.getElementById('sucesso');
  if (!pedido) { caixa.innerHTML = '<p>Nenhum pedido encontrado.</p>'; return; }
  const nomes = { pix: 'PIX', boleto: 'Boleto bancário', debito: 'Cartão de débito', credito: 'Cartão de crédito' };
  let forma = nomes[pedido.pagamento];
  if (pedido.pagamento === 'credito') forma += ' em ' + pedido.parcelas + 'x sem juros';
  caixa.innerHTML = `<h1>🍒 Pedido confirmado!</h1><p>Obrigado, ${pedido.nome}!</p>
    <p>Pedido nº <strong>${pedido.numero}</strong></p><p>Pagamento: ${forma}</p>
    <p>Total: <strong>${formatarPreco(pedido.total)}</strong></p>
    <p>Código de rastreio: <strong>BR-${pedido.numero}-LC</strong></p>
    <ol class="linha-tempo"><li class="feito">Pedido recebido</li><li class="feito">Pagamento aprovado</li><li>Separação &amp; embalagem Furoshiki</li><li>Entrega em 2 a 5 dias úteis</li></ol>
    <p class="simulacao">Simulação escolar: nenhum pagamento real foi feito.</p>
    <a class="btn btn-primario" href="index.html">Voltar à loja</a>`;
}