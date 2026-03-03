let logado = false;

const telaLogin = document.getElementById('tela-login');
const telaApp = document.getElementById('tela-app');
const formLogin = document.getElementById('form-login');
const formNome = document.getElementById('form-nome');
const inputNome = document.getElementById('nome');
const loginNome = document.getElementById('login-nome');
const loginSenha = document.getElementById('login-senha');
const listaNomes = document.querySelector('#lista-nomes ul');
const listaVazia = document.querySelector('#lista-nomes .lista-vazia');

async function carregarNomes() {
  if (!logado) return;
  const response = await fetch('/nomes');
  const { dados } = await response.json();

  listaNomes.innerHTML = '';
  listaVazia.style.display = dados.length > 0 ? 'none' : 'block';

  dados.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.nome} (${new Date(item.data).toLocaleString()})`;
    listaNomes.appendChild(li);
  });
}

async function submitForm(e) {
  e.preventDefault();
  const nome = inputNome.value.trim();

  if (!nome) {
    alert('Preencha o nome.');
    return;
  }

  const body = { nome };
  const response = await fetch('/enviar-nome', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  alert(data.mensagem);

  inputNome.value = '';
  await carregarNomes();
}

async function fazerLogin() {
  const nome = loginNome.value.trim();
  const senha = loginSenha.value.trim();

  if (!nome || !senha) {
    alert('Preencha nome e senha.');
    return;
  }

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, senha })
  });

  const data = await response.json();
  
  if (data.sucesso) {
    logado = true;
    telaLogin.style.display = 'none';
    telaApp.style.display = 'block';
    await carregarNomes();
  } else {
    alert('Login inválido.');
  }
}

formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  fazerLogin();
});

formNome.addEventListener('submit', submitForm);
