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
