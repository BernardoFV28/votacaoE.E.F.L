const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const PORT = 3000;

const matriculasValidas = ['123456', '654321', '987654'];

app.use(session({
  secret: 'votacao-secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints para login
app.post('/login', (req, res) => {
  const { matricula } = req.body;
  if (matriculasValidas.includes(matricula)) {
    req.session.matricula = matricula;
    return res.json({ message: 'Matrícula validada!', status: 'success' });
  }
  return res.json({ message: 'Matrícula inválida! Tente novamente.', status: 'error' });
});

// Endpoints para votar
app.post('/votar', (req, res) => {
  if (!req.session.matricula) {
    return res.json({ message: "Você precisa se autenticar primeiro!", status: 'error' });
  }

  const candidato = req.body.candidato;
  const ipUsuario = req.ip;
  const arquivoIps = 'votos_ips.txt';

  const ipsRegistrados = fs.readFileSync(arquivoIps, 'utf-8').split('\n');
  if (ipsRegistrados.includes(ipUsuario)) {
    return res.json({ message: "Você já votou!", status: 'error' });
  }

  const votos = JSON.parse(fs.readFileSync('votos.json', 'utf-8'));
  votos[candidato] = (votos[candidato] || 0) + 1;
  fs.writeFileSync('votos.json', JSON.stringify(votos, null, 2));

  fs.appendFileSync(arquivoIps, ipUsuario + '\n');
  return res.json({ message: `Voto registrado com sucesso para ${candidato}!`, status: 'success' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

