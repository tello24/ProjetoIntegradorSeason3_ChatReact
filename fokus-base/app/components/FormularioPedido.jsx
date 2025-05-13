import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

export default function FormularioPedido({ onConfirmar, pedidoInicial = {} }) {
  const [nome, setNome] = useState(pedidoInicial.nome || '');
  const [ra, setRA] = useState(pedidoInicial.ra || '');
  const [item, setItem] = useState(pedidoInicial.item || '');
  const [quantidade, setQuantidade] = useState(
    parseInt(pedidoInicial.quantidade) || 1
  );
  const [obs, setObs] = useState(pedidoInicial.obs || '');
  const [mostrarItens, setMostrarItens] = useState(false);

  // Estados para bebida no final do formulário (opcional)
  const [querBebida, setQuerBebida] = useState(pedidoInicial.bebida ? true : false);
  const [bebida, setBebida] = useState(pedidoInicial.bebida || '');
  const opcoesBebida = ['Água', 'Coca Cola', 'Coca Cola Zero', 'Suco'];

  const opcoesItem = [
    'Filé de Frango Grelhado',
    'Linguiça Toscana Grelhada',
    'Linguiça de Frango Grelhada',
    'Filé de Peixe',
    'Frango à Parmegiana',
  ];

  // Função para enviar o pedido para a API
  const handleSubmit = async () => {
    if (!nome || !ra || !item || !quantidade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const pedido = {
      nome,
      ra,       // Certificando que o RA está sendo enviado
      item,     // Certificando que o item está sendo enviado
      quantidade,
      obs,
      bebida: querBebida ? bebida : null, // Se quiser bebida, inclui, caso contrário, não
    };

    try {
      // Enviando os dados para a API no endpoint /pratos
      await axios.post('http://localhost:3001/pratos', pedido);  // Correção para /pratos
      alert('Pedido enviado com sucesso!');
      onConfirmar(); // Se a função onConfirmar for passada como prop
    } catch (error) {
      console.log(error);
      alert('Erro ao enviar o pedido');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
        style={styles.input}
      />

      <Text>RA</Text>
      <TextInput
        value={ra}
        onChangeText={setRA}
        placeholder="Digite seu RA"
        style={styles.input}
      />

      <Text>Item</Text>
      <TextInput
        value={item}
        onChangeText={setItem}
        placeholder="Escolha o item"
        style={styles.input}
      />

      <Text>Quantidade</Text>
      <TextInput
        value={quantidade.toString()}
        onChangeText={(text) => setQuantidade(parseInt(text))}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Observações</Text>
      <TextInput
        value={obs}
        onChangeText={setObs}
        placeholder="Observações adicionais"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
