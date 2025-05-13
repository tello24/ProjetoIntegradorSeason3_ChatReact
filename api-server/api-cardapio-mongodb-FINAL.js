
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conexão com MongoDB Atlas
mongoose.connect('mongodb+srv://eike:retr02305@retr0.vmgy4.mongodb.net/chatbot?retryWrites=true&w=majority&appName=retr0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🌿 Conectado ao MongoDB Atlas'))
.catch((err) => console.error('Erro ao conectar no MongoDB:', err));

// Esquema do prato
const pratoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  categoria: String,
  quantidade: Number,
  obs: String,
});

const Prato = mongoose.model('Prato', pratoSchema);

// Rota para adicionar prato
app.post('/pratos', async (req, res) => {
  try {
    const novoPrato = new Prato(req.body);
    await novoPrato.save();
    res.status(201).json({ mensagem: 'Prato adicionado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar prato' });
  }
});

// Rota para buscar cardápio
app.get('/cardapio', async (req, res) => {
  try {
    const pratos = await Prato.find();
    res.json(pratos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cardápio' });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
