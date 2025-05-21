import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 

export default function Cadastro() {
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [ra, setRa] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const router = useRouter();

  const cadastrarUsuario = async () => {
  console.log('🟡 Início da função');

  if (!email || !senha || !confirmarSenha) {
    Alert.alert('Erro', 'Preencha todos os campos.');
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert('Erro', 'Senhas diferentes');
    return;
  }

  const dados = {
    email,
    senha,
    ...(perfil === 'aluno' && ra ? { ra } : {}),
  };

  console.log('📤 Dados a enviar:', dados);

  try {
    const resposta = await fetch('http://192.168.0.66:3001/cadastro', { // tem q mudar essa 'http://xxxxxxxxxx:3001/cadastro' sempre q o servidor n logar, pode ser q n esteja no msm IP
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    console.log('📥 Status HTTP:', resposta.status);

    const json = await resposta.json();
    console.log('📨 JSON:', json);

    if (!resposta.ok) {
      Alert.alert('Erro', json.erro || 'Erro ao cadastrar');
      return;
    }

    Alert.alert('Sucesso', 'Conta criada com sucesso!');
    router.replace('/chat-aluno');
  } catch (erro) {
    console.error('❌ Erro no cadastro:', erro);
    Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
  }
};



  return (
    <ImageBackground
  source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }}
  style={styles.container}
  resizeMode="cover"
  pointerEvents="box-none"
>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.card}
      >
        <View style={styles.topoCurvo}>
          <Image source={require('./assets/logo.jpg')} style={styles.logo} />
          <Text style={styles.titulo}>Cadastro</Text>
        </View>

        <View style={styles.conteudo}>
          {!perfil ? (
            <>
              <Text style={styles.label}>Sou:</Text>
              <TouchableOpacity style={styles.botaoEscolha} onPress={() => setPerfil('aluno')}>
                <Text style={styles.textoBotao}>Aluno</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoEscolha} onPress={() => setPerfil('professor')}>
                <Text style={styles.textoBotao}>Professor</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.replace('/')}>
                <Text style={styles.textoVoltar}>Voltar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput 
                style={styles.input}
                placeholder={perfil === 'aluno' ? 'Email@p4ed.com' : 'Email'}
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {perfil === 'aluno' && (
                <TextInput
                  style={styles.input}
                  placeholder="RA do Aluno (7 dígitos)"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  maxLength={7}
                  value={ra}
                  onChangeText={setRa}
                />
              )}

              <View style={styles.senhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Senha"
                  placeholderTextColor="#888"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                />
                <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                  <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={24} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.senhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#888"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry={!mostrarConfirmar}
                />
                <TouchableOpacity onPress={() => setMostrarConfirmar(!mostrarConfirmar)}>
                  <Ionicons name={mostrarConfirmar ? 'eye-off' : 'eye'} size={24} color="#888" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.botaoCadastro} onPress={cadastrarUsuario}>
                <Text style={styles.textoBotao}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoVoltar} onPress={() => setPerfil(null)}>
                <Text style={styles.textoVoltar}>Voltar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    height: '85%',
    maxWidth: 420,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  topoCurvo: {
    backgroundColor: '#16C1D7',
    height: 140,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  conteudo: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  inputSenha: {
    flex: 1,
    height: 48,
    color: '#000',
  },
  botaoCadastro: {
    backgroundColor: '#16C1D7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoVoltar: {
    borderColor: '#6cbac9',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  textoVoltar: {
    color: '#6cbac9',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botaoEscolha: {
    backgroundColor: '#16C1D7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
});
