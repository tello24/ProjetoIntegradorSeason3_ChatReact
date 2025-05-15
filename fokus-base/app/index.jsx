import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';

export default function Index() {
  const [perfil, setPerfil] = useState(null); // null, 'aluno' ou 'restaurante'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const { width: screenWidth } = Dimensions.get('window');
  const isDesktop = screenWidth > 700;

  const alunosAutorizados = [
    { email: 'aluno1@email.com', senha: 'senha123' },
    { email: 'aluno2@email.com', senha: 'teste456' },
    { email: 'maria@aluno.com', senha: 'poliedro2024' },
  ];

  const entrar = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (perfil === 'restaurante') {
      if (
        email.toLowerCase() === 'cozinha@sistemapoliedro.com.br' &&
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
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
            styles.retangulo,

           ]}
      >
        <View style={styles.topo}>
          <Image source={require('./assets/logo.jpg')} style={styles.logo} />
          <View style={styles.centroTopo}>
            <Text style={styles.titulo}>Tela Login</Text>
          </View>
        </View>

        <View style={styles.corpo}>
          {!perfil ? (
            <>
              <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={() => setPerfil('aluno')}
              >
                <Text style={styles.textoBotao}>Aluno</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={() => setPerfil('restaurante')}
              >
                <Text style={styles.textoBotao}>Restaurante</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
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

              <TouchableOpacity
                style={styles.botaoPrincipal}
                onPress={entrar}
              >
                <Text style={styles.textoBotao}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => {
                  setPerfil(null);
                  setEmail('');
                  setSenha('');
                }}
              >
                <Text style={styles.textoBotao}>Voltar</Text>
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
  retangulo: {
    backgroundColor: '#fff',
    width: '90%',
    aspectRatio: 9 / 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  topo: {
    backgroundColor: '#16C1D7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  centroTopo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  corpo: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000',
  },
  botaoPrincipal: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoSecundario: {
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
