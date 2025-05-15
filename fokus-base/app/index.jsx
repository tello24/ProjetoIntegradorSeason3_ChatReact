import React, { useState } from 'react';
import { useRouter } from 'expo-router';
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
  Dimensions,
  ImageBackground,
} from 'react-native';

export default function Index() {
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const alunosAutorizados = [
    { email: 'aluno@p4ed.com', senha: 'teste123' },
  ];

  const professoresAutorizados = [
    { email: 'professor@sistemapoliedro.com.br', senha: 'teste123' },
  ];

  const entrar = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (perfil === 'restaurante') {
      if (
        email.toLowerCase() === 'cozinha@gmail.com' &&
        senha === 'teste123'
      ) {
        router.replace('/painel-cozinha');
      } else {
        Alert.alert('Erro', 'Credenciais da cozinha inválidas!');
      }
    } else if (perfil === 'aluno') {
      const autorizado = alunosAutorizados.some(
        (a) =>
          a.email.toLowerCase() === email.toLowerCase() &&
          a.senha === senha
      );
      if (autorizado) {
        router.replace('/chat-aluno');
      } else {
        Alert.alert('Erro', 'Credenciais de aluno inválidas!');
      }
    } else if (perfil === 'professor') {
      const autorizado = professoresAutorizados.some(
        (p) =>
          p.email.toLowerCase() === email.toLowerCase() &&
          p.senha === senha
      );
      if (autorizado) {
        router.replace('/chat-aluno');
      } else {
        Alert.alert('Erro', 'Credenciais de professor inválidas!');
      }
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
            </>
          ) : (
            <>
              <Text style={styles.titulo}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#888"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
              <TouchableOpacity style={styles.botaoLogin} onPress={entrar}>
                <Text style={styles.textoBotaoLogin}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoVoltar} onPress={() => {
                setPerfil(null);
                setEmail('');
                setSenha('');
              }}>
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
});
