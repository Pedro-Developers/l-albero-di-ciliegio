let esqueceuasenha = document.getElementById("forgot-password");
let lembreme = document.getElementById("remember-me");
let googleSigninButton = document.getElementById("google-signin-button");
let appleSigninButton = document.getElementById("apple-signin-button");





esqueceuasenha.addEventListener("click", function() {
    let email = prompt("Por favor, insira seu e-mail para redefinir a senha:");
});

  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Envie este token (response.credential) para o seu backend para validar e criar a sessão do usuário.
  }

  window.onload = function () {
    google.accounts.id.initialize({
      client_id: 'SEU_CLIENT_ID_DO_://googleusercontent.com',
      callback: handleCredentialResponse,
      auto_select: true // Tenta selecionar a conta automaticamente se o usuário já estiver logado no navegador
    });

    // Exibe o prompt do One Tap
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        console.log(notification.getNotDisplayedReason());
      }
    });
  };

  if (window.location.search.includes('error=access_denied')) {
    alert('Acesso negado. Por favor, tente novamente.');
  }

if (googleSigninButton) {
  googleSigninButton.addEventListener("click", function() {
    // Lógica para o botão de login com Google
  });
}




    // 1. Inicialize com as suas credenciais do Apple Developer
    AppleID.auth.init({
        clientId : 'http://127.0.0.1:5500/index.html.si', // Substitua pelo seu Client ID registrado no Apple Developer
        scope : 'name email', // Escopo de informações que você deseja solicitar ao usuário
        redirectURI : 'http://127.0.0.1:5500/index.html',
        usePopup : true // Define se abrirá em formato Pop-up ou Redirecionamento completo
    });

    // 2. Chame a função de login programaticamente
    async function tentarLogarComApple() {
        try {
            const data = await AppleID.auth.signIn();
            // Usuário autenticado com sucesso! 
            // Envie os dados (id_token) para o seu servidor validar.
            console.log(data);
        } catch (error) {
            // Trate o erro ou o cancelamento do usuário
            console.error(error);
        }
    }
if (appleSigninButton) {
  appleSigninButton.addEventListener("click", function() {
    tentarLogarComApple();
  });
}

// Recebe um número (89.9) e devolve texto formatado ("R$ 89,90").
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Recebe UM produto (objeto) e devolve o HTML do card dele.
function criarCardProduto(produto) {
    return `
        <article class="produto">
            <img class="produto-imagem" src="${produto.imagem}" alt="${produto.nome}">
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <span class="produto-preco">${formatarPreco(produto.preco)}</span>
            </div>
        </article>
    `;
}

// Percorre a lista de produtos e coloca os cards dentro da div #lista-produtos.
function mostrarProdutos() {
    const lista = document.getElementById("lista-produtos");
    let html = "";

    for (const produto of produtos) {
        html += criarCardProduto(produto);
    }

    lista.innerHTML = html;
}

// Abre e fecha o menu no celular.
function configurarMenu() {
    const botao = document.getElementById("botao-menu");
    const menu = document.getElementById("menu");

    botao.addEventListener("click", function () {
        menu.classList.toggle("aberto");
    });
}

mostrarProdutos();
configurarMenu();