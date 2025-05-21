const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Conecte-se ao seu banco
mongoose.connect('mongodb+srv://chatbotuser:sistemapoliedro@cluster0.llu10u4.mongodb.net/chatbot-db?retryWrites=true&w=majority')
  .then(() => console.log('🔗 Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// Modelo de usuário
const usuarioSchema = new mongoose.Schema({
  email: String,
  senha: String,
  perfil: String,
  ra: String,
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Função para criar o restaurante
async function criarRestaurante() {
  const email = 'cozinha@gmail.com';
  const senha = 'teste123';
  const perfil = 'restaurante';

  // Verifica se já existe
  const existente = await Usuario.findOne({ email });
  if (existente) {
    console.log('⚠️ Restaurante já está cadastrado.');
    mongoose.disconnect();
    return;
  }

  // Criptografa a senha
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novo = new Usuario({
    email,
    senha: senhaCriptografada,
    perfil,
    ra: null,
  });

  await novo.save();
  console.log('✅ Restaurante cadastrado com sucesso!');
  mongoose.disconnect();
}

criarRestaurante();
