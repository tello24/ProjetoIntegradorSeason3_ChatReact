const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://chatbotuser:sistemapoliedro@cluster0.llu10u4.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => console.log('🔗 Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

const usuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
  perfil: String,
  ra: String,
});
const reservaSchema = new mongoose.Schema({
  ra: String,
  nome: String,
  data: String,
  horario: String,
  pessoas: Number,
  telefone: String,
  observacoes: String,
});
const pedidoSchema = new mongoose.Schema({
  ra: String,
  item: String,
  quantidade: Number,
  observacoes: String,
  status: { type: String, default: 'pendente' },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const Reserva = mongoose.model('Reserva', reservaSchema);
const Pedido = mongoose.model('Pedido', pedidoSchema);

// ROTA DE CADASTRO
app.post('/cadastro', async (req, res) => {
  const { email, senha, ra } = req.body;

  if (!email || !senha || (email.endsWith('@p4ed.com') && !ra)) {
    return res.status(400).json({ erro: 'Campos obrigatórios' });
  }

  const perfil = email.endsWith('@p4ed.com') ? 'aluno'
    : email.endsWith('@sistemapoliedro.com.br') ? 'professor'
    : email.endsWith('@gmail.com') ? 'restaurante'
    : null;

  if (!perfil) return res.status(400).json({ erro: 'Email inválido para cadastro' });

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) return res.status(409).json({ erro: 'Usuário já cadastrado' });

  const senhaHash = await bcrypt.hash(senha, 10);
  const novoUsuario = new Usuario({ email, senha: senhaHash, perfil, ra });
  await novoUsuario.save();

  return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', perfil });
});

// ROTA DE LOGIN
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (email === 'cozinha@gmail.com' && senha === 'teste123') {
  // retorna perfil restaurante mesmo se não estiver cadastrado
  return res.status(200).json({ mensagem: 'Login autorizado', perfil: 'restaurante', ra: null });
}


  if (!email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' });

  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

  return res.status(200).json({ mensagem: 'Login autorizado', perfil: usuario.perfil, ra: usuario.ra });
});

// ROTA DE RESERVA
app.post('/reserva', async (req, res) => {
  try {
    const novaReserva = new Reserva(req.body);
    await novaReserva.save();
    res.status(201).json({ mensagem: 'Reserva registrada com sucesso' });
  } catch (erro) {
    console.error('Erro ao salvar reserva:', erro);
    res.status(500).json({ erro: 'Erro ao registrar reserva' });
  }
});

// ROTA DE PEDIDO
app.post('/pedido', async (req, res) => {
  try {
    const novoPedido = new Pedido(req.body);
    await novoPedido.save();
    res.status(201).json({ mensagem: 'Pedido registrado com sucesso' });
  } catch (erro) {
    console.error('Erro ao salvar pedido:', erro);
    res.status(500).json({ erro: 'Erro ao registrar pedido' });
  }
});

// GET RESERVAS (PAINEL)
app.get('/reservas', async (req, res) => {
  const reservas = await Reserva.find();
  res.json(reservas);
});

// GET PEDIDOS (PAINEL)
app.get('/pedidos', async (req, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos);
});

// Atualizar o status do pedido
app.patch('/pedido/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await Pedido.findByIdAndUpdate(id, { status });
    res.status(200).json({ mensagem: 'Status atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
});

// Excluir um pedido
app.delete('/pedido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Pedido.findByIdAndDelete(id);
    res.status(200).json({ mensagem: 'Pedido excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir pedido' });
  }
});


app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
