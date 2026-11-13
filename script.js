const raiz = ''; 
function formatarPreco(centavos) {
  return 'R$ ' + (centavos / 100).toFixed(2).replace('.', ',');
}

function pegarCarrinho() {
  return JSON.parse(localStorage.getItem('carrinho')) || [];
}
function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContador();
}
function adicionarAoCarrinho(id, quantidade) {
  quantidade = quantidade || 1;
  const carrinho = pegarCarrinho();
  const item = carrinho.find(function (i) { return i.id === id; });
  if (item) { item.qtd += quantidade; } else { carrinho.push({ id: id, qtd: quantidade }); }
  salvarCarrinho(carrinho);
  mostrarAviso('Produto adicionado ao carrinho!');
}
function totalCarrinho() {
  return pegarCarrinho().reduce(function (soma, i) {
    return soma + buscarProduto(i.id).preco * i.qtd;
  }, 0);
}
function calcularFrete(subtotal) {
  return subtotal >= 25000 ? 0 : 1990;
}

function aplicarCupom(codigo) {
  if (codigo.trim().toUpperCase() === 'BEMVINDO10') { localStorage.setItem('cupom', 'BEMVINDO10'); return true; }
  return false;
}
function pegarDesconto(subtotal) {
  return localStorage.getItem('cupom') === 'BEMVINDO10' ? Math.round(subtotal * 0.10) : 0;
}

function alternarTema() {
  const novo = document.documentElement.dataset.tema === 'escuro' ? 'claro' : 'escuro';
  document.documentElement.dataset.tema = novo;
  localStorage.setItem('tema', novo);
}
document.documentElement.dataset.tema = localStorage.getItem('tema') || 'claro';

function mostrarConta() {
  const link = document.getElementById('conta');
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!link || !usuario) return;
  link.textContent = 'Sair (' + usuario.nome.split(' ')[0] + ')';
  link.href = '#';
  link.onclick = function (e) { e.preventDefault(); localStorage.removeItem('usuarioLogado'); location.reload(); };
}

function atualizarContador() {
  const total = pegarCarrinho().reduce(function (s, i) { return s + i.qtd; }, 0);
  const marcador = document.getElementById('contador');
  if (marcador) marcador.textContent = total;
}
function mostrarAviso(texto) {
  const aviso = document.createElement('div');
  aviso.className = 'aviso';
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  setTimeout(function () { aviso.remove(); }, 2000);
}
function montarCabecalhoRodape() {
  if (!document.querySelector('.cabecalho')) {
    document.body.insertAdjacentHTML('afterbegin', `<header class="cabecalho"><div class="container">
      <a href="${raiz}index.html" class="logo">l'albero di ciliegio<small>Bottega Botanica</small></a>
      <nav><ul class="menu"><li><a href="${raiz}index.html">Início</a></li><li><a href="${raiz}produtos.html">Catálogo</a></li><li><a href="${raiz}compra.html">Carrinho</a></li></ul></nav>
      <div class="acoes"><button class="icone" onclick="alternarTema()" title="Tema claro/escuro">🌓</button><a href="${raiz}login.html" id="conta">Entrar</a>
      <a href="${raiz}compra.html" class="carrinho-icone">🛍<span id="contador">0</span></a></div></div></header>`);
  }
  if (!document.querySelector('.rodape')) {
    document.body.insertAdjacentHTML('beforeend', `<footer class="rodape"><div class="container copy"><span>© 2025 l'albero di ciliegio · Projeto escolar</span><span>Pix · Cartão de Crédito · Cartão de Débito (simulação)</span></div></footer>`);
  }
}
document.addEventListener('click', function (e) {
  const botao = e.target.closest('[data-comprar]');
  if (botao) adicionarAoCarrinho(Number(botao.dataset.comprar));
});

montarCabecalhoRodape();
atualizarContador();
mostrarConta();
