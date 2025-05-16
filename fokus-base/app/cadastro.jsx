import React, { useState } from 'react';
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

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const router = useRouter();

  const detectarPerfil = (email) => {
    if (email.endsWith('@p4ed.com')) return 'aluno';
    if (email.endsWith('@sistemapoliedro.com.br')) return 'professor';
    if (email.endsWith('@gmail.com')) return 'restaurante';
    return null;
  };

  const cadastrarUsuario = () => {
    if (!email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const perfil = detectarPerfil(email);
    if (!perfil) {
      Alert.alert('Erro', 'Email inválido. Utilize um email institucional.');
      return;
    }

    Alert.alert('Cadastro realizado', `Perfil detectado: ${perfil}`);
    router.replace('/');
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
          <Text style={styles.titulo}>Cadastro</Text>
        </View>

        <View style={styles.conteudo}>
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
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            placeholderTextColor="#888"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <TouchableOpacity style={styles.botaoCadastro} onPress={cadastrarUsuario}>
            <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
            <Text style={styles.textoVoltar}>Voltar</Text>
          </TouchableOpacity>
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
});
