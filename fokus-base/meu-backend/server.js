// Exemplo de backend (Node.js + Express + MongoDB)
// Salve como server.js ou use dentro do seu backend atual

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose.connect('mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster.mongodb.net/seubanco?retryWrites=true&w=majority')
  .then(() => console.log('🔗 Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Modelo de usuário
const usuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
  perfil: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) return res.status(400).json({ erro: 'Campos obrigatórios' });

  const perfil = email.endsWith('@p4ed.com') ? 'aluno'
    : email.endsWith('@sistemapoliedro.com.br') ? 'professor'
    : email.endsWith('@gmail.com') ? 'restaurante'
    : null;

  if (!perfil) return res.status(400).json({ erro: 'Email inválido para cadastro' });

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) return res.status(409).json({ erro: 'Usuário já cadastrado' });

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = new Usuario({ email, senha: senhaHash, perfil });
  await novoUsuario.save();

  return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', perfil });
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
