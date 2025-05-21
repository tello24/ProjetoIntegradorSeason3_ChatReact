// app/editar-cardapio.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditarCardapio() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);

  const adicionarCategoria = () => {
    setCategorias((prev) => [
      ...prev,
      { id: Date.now().toString(), nome: '', itens: [{ nome: '', preco: '' }] },
    ]);
  };

  const atualizarCategoria = (id, campo, valor) => {
    setCategorias((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [campo]: valor } : cat))
    );
  };

  const adicionarItem = (catId) => {
    setCategorias((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, itens: [...cat.itens, { nome: '', preco: '' }] }
          : cat
      )
    );
  };

  const atualizarItem = (catId, index, campo, valor) => {
    setCategorias((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          const novosItens = [...cat.itens];
          novosItens[index][campo] = valor;
          return { ...cat, itens: novosItens };
        }
        return cat;
      })
    );
  };

  const excluirCategoria = (catId) => {
    setCategorias((prev) => prev.filter((cat) => cat.id !== catId));
  };

  const salvarCardapio = async () => {
    try {
      await AsyncStorage.setItem('cardapio', JSON.stringify(categorias));
      alert('Cardápio salvo com sucesso!');
    } catch (e) {
      console.log('Erro ao salvar cardápio:', e);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.retangulo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topo}>
          <Text style={styles.titulo}>Cardápio</Text>
          <View style={styles.botoesTopo}>
            <TouchableOpacity onPress={() => router.replace('/painel-cozinha')} style={styles.botaoTopo}>
              <Text style={styles.botaoTexto}>Voltar Painel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/')} style={styles.botaoTopo}>
              <Text style={styles.botaoTexto}>Voltar Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {categorias.map((cat, i) => (
            <View key={cat.id} style={styles.card}>
              <TextInput
                placeholder="Nome da Categoria"
                placeholderTextColor="#999"
                style={styles.input}
                value={cat.nome}
                onChangeText={(text) => atualizarCategoria(cat.id, 'nome', text)}
              />
              {cat.itens.map((item, index) => (
                <View key={index} style={styles.itemLinha}>
                  <TextInput
                    placeholder="Nome do Prato"
                    placeholderTextColor="#999"
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    value={item.nome}
                    onChangeText={(text) => atualizarItem(cat.id, index, 'nome', text)}
                  />
                  <TextInput
                    placeholder="Preço"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    style={[styles.input, { width: 80 }]}
                    value={item.preco}
                    onChangeText={(text) => atualizarItem(cat.id, index, 'preco', text)}
                  />
                </View>
              ))}
              <TouchableOpacity onPress={() => adicionarItem(cat.id)} style={styles.adicionarItem}>
                <Text style={styles.adicionarTexto}>+ Item</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => excluirCategoria(cat.id)} style={styles.excluirCategoria}>
                  <Text style={styles.cancelarTexto}>Excluir Categoria</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={salvarCardapio} style={styles.salvarBtn}>
                  <Text style={styles.salvarTexto}>Salvar Cardápio</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity onPress={adicionarCategoria} style={styles.adicionarCategoria}>
            <Text style={styles.adicionarTexto}>+ Adicionar Categoria</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retangulo: {
    backgroundColor: '#fff',
    width: '90%',
    maxWidth: 400,
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
    backgroundColor: '#c0392b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#b03a2e',
  },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  botoesTopo: { flexDirection: 'row', gap: 8 },
  botaoTopo: { backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 },
  botaoTexto: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ddd' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, marginBottom: 10, color: '#000' },
  itemLinha: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  adicionarItem: { backgroundColor: '#2ecc71', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  adicionarTexto: { color: '#fff', fontWeight: 'bold' },
  excluirCategoria: { backgroundColor: '#e74c3c', padding: 8, borderRadius: 8 },
  cancelarTexto: { color: '#fff', fontWeight: 'bold' },
  salvarBtn: { backgroundColor: '#3498db', padding: 8, borderRadius: 8 },
  salvarTexto: { color: '#fff', fontWeight: 'bold' },
  adicionarCategoria: {
    backgroundColor: '#8e44ad',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
});
