const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect('mongodb+srv://chatbotuser:sistemapoliedro@cluster0.llu10u4.mongodb.net/chatbot-db?retryWrites=true&w=majority')
  .then(() => console.log('🔗 Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// MODELOS
const usuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
  perfil: String,
  ra: String,
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

const pedidoSchema = new mongoose.Schema({
  ra: String,
  nome: String,
  item: String,
  quantidade: Number,
  obs: String,
  bebida: String,
  status: String,
  dataHora: String,
});
const Pedido = mongoose.model('Pedido', pedidoSchema);

const reservaSchema = new mongoose.Schema({
  ra: String,
  nome: String,
  data: String,
  horario: String,
  pessoas: String,
  telefone: String,
  obs: String,
});
const Reserva = mongoose.model('Reserva', reservaSchema);

// ROTAS

// Cadastro
app.post('/cadastro', async (req, res) => {
  const { email, senha, ra } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  // FORÇA o perfil com base no domínio do e-mail
  let perfil = null;

  if (email.endsWith('@p4ed.com')) {
    perfil = 'aluno';
  } else if (email.endsWith('@sistemapoliedro.com.br')) {
    perfil = 'professor';
  } else {
    return res.status(400).json({ erro: 'Email inválido. Use um domínio autorizado.' });
  }

  // Impede que alunos usem email de professor e vice-versa
  if (perfil === 'aluno' && (!ra || ra.length !== 7 || !/^\d+$/.test(ra))) {
    return res.status(400).json({ erro: 'RA inválido. Precisa conter exatamente 7 números.' });
  }

  const emailExistente = await Usuario.findOne({ email });
  if (emailExistente) {
    return res.status(409).json({ erro: 'E-mail já cadastrado' });
  }

  if (perfil === 'aluno') {
    const raExistente = await Usuario.findOne({ ra });
    if (raExistente) {
      return res.status(409).json({ erro: 'RA já cadastrado' });
    }
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = new Usuario({
    email,
    senha: senhaHash,
    perfil,
    ra: perfil === 'aluno' ? ra : null,
  });

  await novoUsuario.save();
  return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', perfil });
});




// Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // Acesso hardcoded do restaurante
  if (email === 'cozinha@gmail.com' && senha === 'teste123') {
    return res.json({ perfil: 'restaurante' });
  }

  // Acesso normal para alunos/professores
  const user = await Usuario.findOne({ email });
  if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return res.status(401).json({ erro: 'Senha incorreta' });

  res.json({ perfil: user.perfil, ra: user.ra });
});


// Salvar pedido
app.post('/pedido', async (req, res) => {
  const novo = new Pedido({ ...req.body, status: 'Pendente', dataHora: new Date().toLocaleString('pt-BR') });
  await novo.save();
  res.status(201).json({ mensagem: 'Pedido salvo' });
});

// Buscar pedidos
app.get('/pedidos', async (_, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos);
});

// Atualizar status do pedido
app.put('/pedidos/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await Pedido.findByIdAndUpdate(id, { status });
  res.json({ mensagem: 'Status atualizado' });
});

// Deletar pedido
app.delete('/pedidos/:id', async (req, res) => {
  const { id } = req.params;
  await Pedido.findByIdAndDelete(id);
  res.json({ mensagem: 'Pedido excluído' });
});

// Salvar reserva
app.post('/reserva', async (req, res) => {
  const nova = new Reserva(req.body);
  await nova.save();
  res.status(201).json({ mensagem: 'Reserva salva' });
});

// Buscar reservas
app.get('/reservas', async (_, res) => {
  const reservas = await Reserva.find();
  res.json(reservas);
});

// Deletar reserva
app.delete('/reservas/:id', async (req, res) => {
  const { id } = req.params;
  await Reserva.findByIdAndDelete(id);
  res.json({ mensagem: 'Reserva excluída' });
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
