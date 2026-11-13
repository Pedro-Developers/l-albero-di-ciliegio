// Lista de produtos. Preço em CENTAVOS (18990 = R$ 189,90) para não ter erro de arredondamento.
const produtos = [
  { id: 1, nome: 'Vaso Sakura Imperial', categoria: 'Cerâmicas', preco: 54000, img: 'img/hero.jpg', etiqueta: 'PEÇA EM DESTAQUE', descricao: 'Assinado à mão pelo mestre oleiro. Esmalte rosado com acabamento craquelê.' },
  { id: 2, nome: 'Vaso de Cerâmica Sakura Artesanal', categoria: 'Cerâmicas', preco: 18990, img: 'img/vaso.jpg', etiqueta: 'FLOR DE CEREJEIRA', descricao: 'Cor Rosa Cerejeira, argila rústica vitrificada.' },
  { id: 3, nome: 'Difusor Botânico Flor de Cerejeira', categoria: 'Velas & Aromas', preco: 14500, img: 'img/difusor.jpg', etiqueta: 'AROMA PURO', descricao: '250ml com varetas naturais de salgueiro.' },
  { id: 4, nome: 'Conjunto Xícaras Porcelana Esmaltada', categoria: 'Mesa & Chá', preco: 21000, img: 'img/xicaras.jpg', etiqueta: 'EDIÇÃO LIMITADA', descricao: 'Par de xícaras com pigmentos orgânicos e craquelê sutil.' },
  { id: 5, nome: 'Vela Aromática Cera de Soja & Sakura', categoria: 'Velas & Aromas', preco: 9800, img: 'img/vela.jpg', etiqueta: '100% VEGETAL', descricao: 'Pavio de madeira natural, queima de 45h.' }
];

// Recebe um id e devolve o produto correspondente
function buscarProduto(id) {
  return produtos.find(function (p) { return p.id === id; });
}

// Recebe um produto e devolve o HTML do card
function cardProduto(p) {
  return `<article class="card">
    <a class="foto" href="${raiz}produto.html?id=${p.id}"><img src="${raiz}${p.img}" alt="${p.nome}"><span class="etiqueta">${p.etiqueta}</span></a>
    <small class="estoque"><span>${p.categoria}</span></small>
    <h3><a href="${raiz}produto.html?id=${p.id}">${p.nome}</a></h3>
    <p class="descricao">${p.descricao}</p>
    <div class="compra"><span class="preco">${formatarPreco(p.preco)}</span><button class="btn btn-primario" data-comprar="${p.id}">Comprar</button></div>
  </article>`;
}

// Catálogo: filtra por busca, categoria e preço máximo, ordena e desenha os cards
function mostrarCatalogo() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const categoria = document.getElementById('categoria').value;
  const precoMax = Number(document.getElementById('preco').value);
  const ordem = document.getElementById('ordem').value;
  document.getElementById('valor-preco').textContent = formatarPreco(precoMax);
  const filtrados = produtos.filter(function (p) {
    return (categoria === 'Todos' || p.categoria === categoria) && p.nome.toLowerCase().includes(busca) && p.preco <= precoMax;
  });
  if (ordem === 'menor') filtrados.sort(function (x, y) { return x.preco - y.preco; });
  if (ordem === 'maior') filtrados.sort(function (x, y) { return y.preco - x.preco; });
  document.getElementById('lista').innerHTML = filtrados.map(cardProduto).join('') || '<p>Nenhum produto encontrado.</p>';
}

// Botão da página de detalhes: adiciona a quantidade escolhida
function adicionarVarios(id) {
  adicionarAoCarrinho(id, Number(document.getElementById('qtd-detalhe').value) || 1);
}

// Detalhes: lê o ?id= da URL e mostra aquele produto
function mostrarDetalhe() {
  const id = Number(new URLSearchParams(location.search).get('id'));
  const p = buscarProduto(id);
  const caixa = document.getElementById('detalhe');
  if (!p) { caixa.innerHTML = '<p>Produto não encontrado.</p>'; return; }
  document.title = p.nome + " | l'albero di ciliegio";
  caixa.innerHTML = `<div class="foto-detalhe"><img src="${raiz}${p.img}" alt="${p.nome}"></div>
    <div><span class="selo">${p.etiqueta}</span><h1>${p.nome}</h1>
    <p class="descricao-grande">${p.descricao}</p>
    <p class="preco-grande">${formatarPreco(p.preco)}</p>
    <p><small>ou 6x de ${formatarPreco(Math.round(p.preco / 6))} sem juros</small></p><br>
    <label>Quantidade <input type="number" id="qtd-detalhe" value="1" min="1" max="10" style="width:70px"></label><br><br>
    <button class="btn btn-primario" onclick="adicionarVarios(${p.id})">Adicionar ao carrinho</button>
    <a class="btn btn-secundario" href="produtos.html">Voltar ao catálogo</a></div>`;
}