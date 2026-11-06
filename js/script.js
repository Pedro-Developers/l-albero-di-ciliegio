// Funções usadas em todas as páginas.
// "raiz" ajusta os caminhos: páginas dentro de /pages/ precisam voltar uma pasta ("../")
const raiz = location.pathname.includes('/pages/') ? '../' : '';

// Recebe centavos (18990) e devolve texto "R$ 189,90"
function formatarPreco(centavos) {
  return 'R$ ' + (centavos / 100).toFixed(2).replace('.', ',');
}

// ----- Carrinho salvo no localStorage (guarda texto no navegador, mesmo ao trocar de página) -----
// O carrinho é uma lista de { id, qtd }. JSON.stringify vira texto; JSON.parse volta a ser lista.
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
// Soma preço x quantidade de todos os itens (em centavos)
function totalCarrinho() {
  return pegarCarrinho().reduce(function (soma, i) {
    return soma + buscarProduto(i.id).preco * i.qtd;
  }, 0);
}
// Frete grátis a partir de R$ 250,00 (25000 centavos); abaixo disso, R$ 19,90
function calcularFrete(subtotal) {
  return subtotal >= 25000 ? 0 : 1990;
}

// Cupom BEMVINDO10 = 10% de desconto sobre o subtotal
function aplicarCupom(codigo) {
  if (codigo.trim().toUpperCase() === 'BEMVINDO10') { localStorage.setItem('cupom', 'BEMVINDO10'); return true; }
  return false;
}
function pegarDesconto(subtotal) {
  return localStorage.getItem('cupom') === 'BEMVINDO10' ? Math.round(subtotal * 0.10) : 0;
}

// ----- Tema claro/escuro: troca o atributo data-tema do <html>; o CSS faz o resto -----
function alternarTema() {
  const novo = document.documentElement.dataset.tema === 'escuro' ? 'claro' : 'escuro';
  document.documentElement.dataset.tema = novo;
  localStorage.setItem('tema', novo);
}
document.documentElement.dataset.tema = localStorage.getItem('tema') || 'claro';

// Se há usuário logado, o link "Entrar" vira "Sair"
function mostrarConta() {
  const link = document.getElementById('conta');
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!link || !usuario) return;
  link.textContent = 'Sair (' + usuario.nome.split(' ')[0] + ')';
  link.href = '#';
  link.onclick = function (e) { e.preventDefault(); localStorage.removeItem('usuarioLogado'); location.reload(); };
}

// ----- Interface comum -----
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
// Páginas internas não repetem cabeçalho/rodapé no HTML: o JS desenha os dois
function montarCabecalhoRodape() {
  if (!document.querySelector('.cabecalho')) {
    document.body.insertAdjacentHTML('afterbegin', `<header class="cabecalho"><div class="container">
      <a href="${raiz}index.html" class="logo">l'albero di ciliegio<small>Bottega Botanica</small></a>
      <nav><ul class="menu"><li><a href="${raiz}index.html">Início</a></li><li><a href="${raiz}pages/produtos.html">Catálogo</a></li><li><a href="${raiz}pages/carrinho.html">Carrinho</a></li></ul></nav>
      <div class="acoes"><button class="icone" onclick="alternarTema()" title="Tema claro/escuro">🌓</button><a href="${raiz}pages/login.html" id="conta">Entrar</a>
      <a href="${raiz}pages/carrinho.html" class="carrinho-icone">🛍<span id="contador">0</span></a></div></div></header>`);
  }
  if (!document.querySelector('.rodape')) {
    document.body.insertAdjacentHTML('beforeend', `<footer class="rodape"><div class="container copy"><span>© 2025 l'albero di ciliegio · Projeto escolar</span><span>Pix · Cartão de Crédito · Cartão de Débito (simulação)</span></div></footer>`);
  }
}

// Qualquer botão com data-comprar="ID" adiciona aquele produto ao carrinho
document.addEventListener('click', function (e) {
  const botao = e.target.closest('[data-comprar]');
  if (botao) adicionarAoCarrinho(Number(botao.dataset.comprar));
});

montarCabecalhoRodape();
atualizarContador();
mostrarConta();