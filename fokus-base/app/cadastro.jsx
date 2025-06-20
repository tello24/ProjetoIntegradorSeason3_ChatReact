
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LOGIN_URL } from './utils/config';
import Toast from 'react-native-root-toast';
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
  Animated,
} from 'react-native';

export default function Cadastro() {
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [ra, setRa] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [scale] = useState(new Animated.Value(1)); // Usaremos para o efeito de escala
  const [fadeAnim] = useState(new Animated.Value(0)); // Usaremos para o efeito de fadeInUp
  const router = useRouter();

  // Função para cadastrar o usuário
  const cadastrarUsuario = async () => {
    if (!email || !senha || !confirmarSenha) {
      Toast.show('Preencha todos os campos.', { duration: Toast.durations.SHORT });
      return;
    }

    if (senha !== confirmarSenha) {
      Toast.show('Senhas diferentes.', { duration: Toast.durations.SHORT });
      return;
    }

    const dados = {
      email,
      senha,
      perfil,
      ...(perfil === 'aluno' && ra ? { ra } : {}),
    };

    try {
      const resposta = await fetch(`${BASE_URL}/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      const json = await resposta.json();

      if (!resposta.ok) {
        Toast.show(json.erro || 'Erro ao cadastrar.', { duration: Toast.durations.LONG });
        return;
      }

      Toast.show('Conta criada com sucesso!', { duration: Toast.durations.SHORT });
      router.replace('/chat-aluno');
    } catch (erro) {
      console.error('❌ Erro no cadastro:', erro);
      Toast.show('Erro de conexão com o servidor.', { duration: Toast.durations.LONG });
    }
  };

  // Função para animar o botão
  const animarBotao = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  // Animação fadeInUp para os botões
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
              <Animated.View
                style={{
                  transform: [{ scale: scale }],
                  opacity: fadeAnim,
                }}
              >
                <TouchableOpacity
                  style={styles.botaoEscolha}
                  onPress={() => {
                    setPerfil('aluno');
                    animarBotao();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoBotao}>Aluno</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  transform: [{ scale: scale }],
                  opacity: fadeAnim,
                }}
              >
                <TouchableOpacity
                  style={styles.botaoEscolha}
                  onPress={() => {
                    setPerfil('professor');
                    animarBotao();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoBotao}>Professor</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={{
                  transform: [{ scale: scale }],
                  opacity: fadeAnim,
                }}
              >
                <TouchableOpacity
                  style={styles.botaoVoltar}
                  onPress={() => router.replace('/')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoVoltar}>Voltar</Text>
                </TouchableOpacity>
              </Animated.View>
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

              <TouchableOpacity
                style={styles.botaoCadastro}
                onPress={cadastrarUsuario}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotao}>Cadastrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => setPerfil(null)}
                activeOpacity={0.8}
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
