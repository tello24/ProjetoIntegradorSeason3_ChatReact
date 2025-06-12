import React, { useState, useEffect } from 'react';
import Toast from 'react-native-root-toast';
import { CARDAPIO_URL } from './utils/config';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';

export default function EditarCardapio() {
  const router = useRouter();
  const [categorias, setCategorias] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // Controla a animação de fadeInUp

  const carregarCardapio = async () => {
    try {
      const resposta = await fetch(CARDAPIO_URL);
      const json = await resposta.json();

      if (json?.categorias) {
        const formatadas = json.categorias.map((cat) => ({
          ...cat,
          id: cat._id,
          _id: cat._id,
          itens: cat.itens.map((item) => ({
            ...item,
            id: item._id || Date.now().toString() + Math.random(),
            _id: item._id,
          })),
        }));
        setCategorias(formatadas);
      }
    } catch (e) {
      console.log('❌ Erro ao carregar cardápio:', e);
    }
  };

  useEffect(() => {
    carregarCardapio();

    // Inicia a animação de fadeInUp
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const adicionarCategoria = () => {
    const novoId = Date.now().toString();
    setCategorias((prev) => [
      ...prev,
      {
        id: novoId,
        nome: '',
        itens: [
          {
            id: Date.now().toString() + Math.random(),
            nome: '',
            preco: '',
          },
        ],
      },
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
          ? {
              ...cat,
              itens: [
                ...cat.itens,
                {
                  id: Date.now().toString() + Math.random(),
                  nome: '',
                  preco: '',
                },
              ],
            }
          : cat
      )
    );
  };

  const excluirItem = async (catId, itemId) => {
    if (!catId || !itemId) {
      console.error('❌ ID indefinido:', { catId, itemId });
      return;
    }
    try {
      const resposta = await fetch(`${CARDAPIO_URL}/item/${catId}/${itemId}`, {
        method: 'DELETE',
      });

      const json = await resposta.json();

      if (!resposta.ok) {
        throw new Error(json.erro || 'Erro ao excluir item');
      }

      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === catId
            ? { ...cat, itens: cat.itens.filter((item) => item._id?.toString() !== itemId) }
            : cat
        )
      );

      Toast.show('❌ Item excluído com sucesso!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (e) {
      console.log('❌ Erro ao excluir item:', e);
      Toast.show('Erro ao excluir item do banco', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  const removerUltimoItem = (catId) => {
    setCategorias((prev) =>
      prev.map((cat) => {
        if (cat.id === catId && cat.itens.length > 1) {
          const novosItens = cat.itens.slice(0, -1);
          return { ...cat, itens: novosItens };
        }
        return cat;
      })
    );
  };

  const atualizarItem = (catId, index, campo, valor) => {
    const convertido = campo === 'preco' ? valor.replace(',', '.') : valor;

    setCategorias((prev) =>
      prev.map((cat) => {
        if (cat.id !== catId) return cat;

        const novosItens = cat.itens.map((it, i) =>
          i === index ? { ...it, [campo]: convertido } : { ...it }
        );

        return { ...cat, itens: novosItens };
      })
    );
  };

  const excluirCategoria = async (catId) => {
    try {
      const resposta = await fetch(`${CARDAPIO_URL}/${catId}`, {
        method: 'DELETE',
      });

      if (!resposta.ok) {
        const texto = await resposta.text();
        console.log('🔴 Erro bruto do backend:', texto);
        throw new Error('Erro ao excluir categoria');
      }

      const json = await resposta.json();

      setCategorias((prev) => prev.filter((cat) => cat._id !== catId));

      Toast.show('✅ Categoria excluída com sucesso!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (e) {
      console.log('❌ Erro ao excluir categoria:', e);
      Toast.show('❌ Erro ao excluir categoria do banco', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  const salvarCardapio = async () => {
    try {
      const resposta = await fetch(CARDAPIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorias }),
      });

      const json = await resposta.json();

      if (!resposta.ok) throw new Error(json.erro || 'Erro desconhecido');

      if (json.categorias) {
        const formatadas = json.categorias.map((cat) => ({
          ...cat,
          id: cat._id,
          _id: cat._id,
          itens: cat.itens.map((item) => ({
            ...item,
            id: item._id,
            _id: item._id,
          })),
        }));
        setCategorias(formatadas);
      }

      Toast.show('Categorias salvas com sucesso!', {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (e) {
      console.log('❌ Erro ao salvar categorias:', e);
      Toast.show('Erro ao salvar categorias', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
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
              <Text style={styles.botaoTexto}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={carregarCardapio} style={styles.botaoRecarregar}>
              <MaterialIcons name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {categorias.map((cat) => (
            <Animated.View key={cat.id} style={{ opacity: fadeAnim }}>
              <View style={styles.card}>
                <TextInput
                  placeholder="Nome da Categoria"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={cat.nome}
                  onChangeText={(text) => atualizarCategoria(cat.id || cat.id, 'nome', text)}
                />
                {cat.itens.map((item, index) => (
                  <View key={item.id} style={styles.itemLinha}>
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
                      value={item.preco != null ? item.preco.toString() : ''}
                      onChangeText={(text) => atualizarItem(cat.id, index, 'preco', text)}
                    />
                    <TouchableOpacity onPress={() => excluirItem(cat._id, item._id)} style={styles.botaoExcluirItem}>
                      <Text style={styles.textoBotaoExcluirItem}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => adicionarItem(cat.id)} style={styles.adicionarItem}>
                    <Text style={styles.adicionarTexto}>+ Item</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removerUltimoItem(cat.id)} style={[styles.adicionarItem, { backgroundColor: '#e67e22' }]}>
                    <Text style={styles.adicionarTexto}>- Item</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => excluirCategoria(cat._id)} style={styles.excluirCategoria}>
                    <Text style={styles.cancelarTexto}>Excluir Categoria</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={salvarCardapio} style={styles.salvarBtn}>
                    <Text style={styles.salvarTexto}>Salvar Cardápio</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
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
    backgroundColor: '#16C1D7',
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
    backgroundColor: '#7A9FBF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },

  botaoExcluirItem: {
  backgroundColor: '#e74c3c',
  borderRadius: 50,
  width: 35,
  height: 35,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 4,
  shadowColor: '#000',
},

textoBotaoExcluirItem: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  lineHeight: 20,
},

botaoRecarregar: {
  borderColor: '#FFF',
  borderWidth: 1,
  borderRadius: 8,
  paddingVertical: 3,
  alignItems: 'center',
},
});
