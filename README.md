# 🍒 l'albero di ciliegio

## Sobre o projeto

**l'albero di ciliegio** é uma loja virtual desenvolvida como projeto avaliativo da disciplina de Criação de Sites.

O projeto tem como objetivo simular uma experiência de compra em um e-commerce, permitindo que o usuário navegue pelos produtos, visualize seus detalhes, adicione itens ao carrinho e realize uma simulação do processo de compra.

A loja possui identidade visual própria, inspirada em uma estética delicada e moderna, utilizando elementos relacionados a cerejas e flores de cerejeira.

## 🛒 Funcionalidades

- Página inicial da loja;
- Navegação entre páginas e seções;
- Categorias de produtos;
- Exibição de produtos com imagem, nome, descrição e preço;
- Visualização dos detalhes dos produtos;
- Adição de produtos ao carrinho;
- Alteração da quantidade de produtos;
- Remoção de produtos do carrinho;
- Cálculo do valor total da compra;
- Formulário de finalização do pedido;
- Cadastro e login demonstrativos, com sessão compartilhada entre as páginas no mesmo navegador;
- Seleção da forma de pagamento;
- Simulação de pagamento por:
  - 💳 Cartão de crédito;
  - 💳 Cartão de débito;
  - 📱 PIX;
- Simulação de parcelamento no cartão de crédito;
- Confirmação da realização do pedido;
- Interface responsiva para diferentes tamanhos de tela.

## 💻 Tecnologias utilizadas

- **HTML5** — estrutura das páginas;
- **CSS3** — estilização, layout e responsividade;
- **JavaScript** — interações, carrinho de compras, cálculos e funcionalidades;
- **Git** — controle de versão;
- **GitHub** — armazenamento e publicação do código-fonte.

## 📁 Estrutura do projeto

```text
l-albero-di-ciliegio/
│
├── index.html        (página inicial)
├── produtos.html     (catálogo com busca e filtros)
├── produto.html      (detalhes do produto)
├── compra.html       (carrinho)
├── checkout.html     (finalização e pagamento simulado)
├── sucesso.html      (pedido confirmado)
├── login.html
├── cadastro.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── produtos.js   (lista de produtos, catálogo e detalhes)
│   ├── script.js     (carrinho, cupom, tema e funções comuns)
│   ├── carrinho.js   (tela do carrinho)
│   ├── checkout.js   (checkout, pagamento e sucesso)
│   └── acesso.js     (login e cadastro)
│
├── img/
└── README.md
```

## ▶️ Como executar

Baixe o projeto e abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code).
