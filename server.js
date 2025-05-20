const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware para JSON e arquivos estáticos
app.use(express.json());

// Serve arquivos estáticos da pasta "public" (CSS, JS, imagens, etc)
app.use(express.static(path.join(__dirname, 'public')));

// Serve páginas HTML da pasta "pages"
app.use(express.static(path.join(__dirname, 'pages')));

// Caminho para o arquivo de dados
const filePath = path.join(__dirname, 'responsaveis.json');

// Rota inicial redireciona para a tela de cadastro
app.get('/', (req, res) => {
  res.redirect('/responsaveis/cadastrar.html');
});

// Rota POST: recebe dados e salva no JSON
app.post('/PassUsers', (req, res) => {
  const novoResponsavel = req.body;
  let responsaveis = [];

  if (fs.existsSync(filePath)) {
    const dadosAtuais = fs.readFileSync(filePath, 'utf8');
    responsaveis = JSON.parse(dadosAtuais);
  }

  // Armazena o CPF sem formatação para facilitar comparação
  novoResponsavel.cpf = novoResponsavel.cpf.replace(/\D/g, '');

  responsaveis.push(novoResponsavel);
  fs.writeFileSync(filePath, JSON.stringify(responsaveis, null, 2));

  res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
});

// Rota GET: retorna todos os responsáveis com CPF formatado
app.get('/PassUsers', (req, res) => {
  if (fs.existsSync(filePath)) {
    const dados = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const dadosFormatados = dados.map(resp => ({
      ...resp,
      cpf: formatarCPF(resp.cpf)
    }));

    res.json(dadosFormatados);
  } else {
    res.json([]);
  }
});

// Rota DELETE: remove um responsável pelo CPF (remove formatação para comparar)
app.delete('/PassUsers/:cpf', (req, res) => {
  const cpf = req.params.cpf.replace(/\D/g, ''); // CPF limpo

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Arquivo de dados não encontrado.' });
  }

  const dados = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const novosDados = dados.filter(resp => resp.cpf.replace(/\D/g, '') !== cpf);

  if (dados.length === novosDados.length) {
    return res.status(404).json({ message: 'Responsável não encontrado.' });
  }

  fs.writeFileSync(filePath, JSON.stringify(novosDados, null, 2));
  res.json({ message: 'Responsável excluído com sucesso.' });
});

// Função utilitária para formatar CPF no formato 000-000-000-00
function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for número
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1-$2-$3-$4");
}

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
