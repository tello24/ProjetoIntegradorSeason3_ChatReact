import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';

export default function Index() {
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const router = useRouter();

  const entrar = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    // Verificação extra antes de enviar
  if (perfil === 'aluno' && !email.endsWith('@p4ed.com')) {
    Alert.alert('Erro', 'Email de aluno deve terminar com @p4ed.com');
    return;
  }
  if (perfil === 'professor' && !email.endsWith('@sistemapoliedro.com.br')) {
    Alert.alert('Erro', 'Email de professor deve terminar com @sistemapoliedro.com.br');
    return;
  }
  if (perfil === 'restaurante' && email !== 'cozinha@gmail.com') {
    Alert.alert('Erro', 'Email errado');
    return;
  }

    try {
      const resposta = await fetch('http://10.2.2.232:3001/login', { // tem q mudar essa 'http://xxxxxxxxxx:3001/cadastro' sempre q o servidor n logar, pode ser q n esteja no msm IP
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const json = await resposta.json();
      console.log('🔵 Resposta do backend:', json);

      if (!resposta.ok) {
  if (json.erro === 'Usuário não encontrado') {
    Alert.alert('Erro', 'E-mail não encontrado. Verifique e tente novamente.');
  } else if (json.erro === 'Senha incorreta') {
    Alert.alert('Erro', 'Senha incorreta. Tente novamente.');
  } else {
    Alert.alert('Erro', json.erro || 'Erro no login.');
  }
  return;
}


      // Roteamento conforme perfil vindo do backend
if (json.perfil === 'restaurante') {
  router.replace('/painel-cozinha');
} else if (json.perfil === 'aluno') {
  await AsyncStorage.setItem('ra', json.ra || '');
  router.replace('/chat-aluno');
} else if (json.perfil === 'professor') {
  Alert.alert('Área restrita', 'Login de professor ainda não está disponível.');
} else {
  Alert.alert('Erro', 'Perfil não reconhecido.');
}


    } catch (erro) {
      console.error('Erro no login:', erro);
      Alert.alert('Erro', 'Não foi possível conectar com o servidor.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.card}
      >
        <View style={styles.topoCurvo}>
          <Image source={require('./assets/logo.jpg')} style={styles.logo} />
        </View>

        <View style={styles.conteudo}>
          {!perfil ? (
            <>
              <Text style={styles.titulo}>Entrar como:</Text>
              <TouchableOpacity
                style={[styles.botaoEscolha, { marginTop: 10 }]}
                onPress={() => setPerfil('aluno')}
              >
                <Text style={styles.textoBotao}>Aluno</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoEscolha}
                onPress={() => setPerfil('professor')}
              >
                <Text style={styles.textoBotao}>Professor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoEscolha}
                onPress={() => setPerfil('restaurante')}
              >
                <Text style={styles.textoBotao}>Restaurante</Text>
              </TouchableOpacity>

              <View style={styles.areaCriarConta}>
                <TouchableOpacity onPress={() => router.push('/cadastro')}>
                  <Text style={styles.textoCriarConta}>Criar Conta</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.titulo}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder={perfil === 'aluno' ? 'Email@p4ed.com' : "Email"}
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.inputSenhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Senha"
                  placeholderTextColor="#888"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!senhaVisivel}
                />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                  <Ionicons
                    name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.botaoLogin} onPress={entrar}>
                <Text style={styles.textoBotaoLogin}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => {
                  setPerfil(null);
                  setEmail('');
                  setSenha('');
                }}
              >
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    height: '80%',
    maxWidth: 400,
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
    marginBottom: 100,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  conteudo: {
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoEscolha: {
    backgroundColor: '#16C1D7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  botaoLogin: {
    backgroundColor: '#16C1D7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  textoBotaoLogin: {
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
  areaCriarConta: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoCriarConta: {
    color: '#16C1D7',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  inputSenhaContainer: {
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
    paddingVertical: 12,
    color: '#000',
  },
});
