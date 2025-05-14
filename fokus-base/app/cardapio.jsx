import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function Cardapio() {
  const [pratos, setPratos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  // Função para carregar os pratos da API
  const carregarCardapio = async () => {
    try {
      const response = await axios.get('https://ai4owum-anonymous-8081.exp.direct/cardapio');
      setPratos(response.data); // Atualiza o estado com os pratos do banco
    } catch (error) {
      console.log(error);
      setMensagem('Erro ao carregar cardápio');
    }
  };

  // Carregar os pratos quando o componente for montado
  useEffect(() => {
    carregarCardapio(); // Chama a função para carregar os pratos
  }, []); // O array vazio [] faz com que a função seja chamada apenas uma vez

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cardápio</Text>
      {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}

      <FlatList
        data={pratos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.pratoContainer}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.categoria}>Categoria: {item.categoria}</Text>
            <Text style={styles.preco}>R$ {item.preco}</Text>
            <Text style={styles.quantidade}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.obs}>{item.obs || 'Sem observações'}</Text>

            {/* Botão para editar o prato (se for necessário) */}
            <TouchableOpacity style={styles.botaoEditar}>
              <Text style={styles.botaoTexto}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  mensagem: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  pratoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  categoria: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  preco: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantidade: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  obs: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  botaoEditar: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
