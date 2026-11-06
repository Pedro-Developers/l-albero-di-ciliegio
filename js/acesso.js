// Login e cadastro SIMULADOS: os usuários ficam só no localStorage deste navegador.
function pegarUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios')) || [];
}
function mostrarErro(texto) {
  document.getElementById('erro').textContent = texto;
}
function entrarNaConta(usuario) {
  localStorage.setItem('usuarioLogado', JSON.stringify({ nome: usuario.nome, email: usuario.email }));
  location.href = '../index.html';
}

function cadastrar(e) {
  e.preventDefault();
  const f = e.target;
  if (f.senha.value.length < 6) return mostrarErro('A senha precisa ter pelo menos 6 caracteres.');
  if (f.senha.value !== f.confirmar.value) return mostrarErro('As senhas não conferem.');
  const usuarios = pegarUsuarios();
  if (usuarios.some(function (u) { return u.email === f.email.value; })) return mostrarErro('Este e-mail já está cadastrado.');
  const novo = { nome: f.nome.value, email: f.email.value, senha: f.senha.value };
  usuarios.push(novo);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  entrarNaConta(novo);
}

function entrar(e) {
  e.preventDefault();
  const f = e.target;
  const usuario = pegarUsuarios().find(function (u) { return u.email === f.email.value && u.senha === f.senha.value; });
  if (!usuario) return mostrarErro('E-mail ou senha incorretos.');
  entrarNaConta(usuario);
}