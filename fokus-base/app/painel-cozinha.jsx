// app/painel-cozinha.jsx atualizado com botões de status dos pedidos

import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PainelCozinha() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
  const carregarDados = async () => {
    const dadosPedidos = await AsyncStorage.getItem('todosPedidos');
    const dadosReservas = await AsyncStorage.getItem('todasReservas');

    if (dadosPedidos) setPedidos(JSON.parse(dadosPedidos));
    if (dadosReservas) setReservas(JSON.parse(dadosReservas));
  };

  carregarDados();
}, []);


  const atualizarStatus = async (index, novoStatus) => {
    const atualizados = [...pedidos];
    atualizados[index].status = novoStatus;
    setPedidos(atualizados);
    await AsyncStorage.setItem('todosPedidos', JSON.stringify(atualizados));
  };

 const excluirPedido = async (index) => {
  const atualizados = pedidos.filter((_, i) => i !== index);
  setPedidos(atualizados);
  await AsyncStorage.setItem('todosPedidos', JSON.stringify(atualizados));

  // Verifica se o pedido excluído é o mesmo que está salvo como "ultimoPedido"
  const ultimo = await AsyncStorage.getItem('ultimoPedido');
  if (ultimo) {
    const pedidoExcluido = pedidos[index];
    const pedidoSalvo = JSON.parse(ultimo);
    if (pedidoExcluido?.nome === pedidoSalvo?.nome && pedidoExcluido?.ra === pedidoSalvo?.ra) {
      await AsyncStorage.removeItem('ultimoPedido');
    }
  }
};


  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.retangulo}>
        <View style={styles.topo}>
          <Text style={styles.titulo}>Painel da Cozinha</Text>
          <View style={styles.botoesTopo}>
            <TouchableOpacity style={styles.botaoTopo} onPress={()=>router.push('/cardapio')}>
              <Text style={styles.textoBotaoTopo}>Editar Cardápio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoTopo} onPress={() => router.replace('/')}> 
              <Text style={styles.textoBotaoTopo}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.conteudo}>
          <Text style={styles.subtitulo}>📋 Reservas</Text>
          {reservas.map((res, index) => (
            <View key={index} style={styles.card}>
              <Text>👤 {res.nome}</Text>
              <Text>📅 {res.data} às {res.horario}</Text>
              <Text>👥 {res.pessoas} pessoa(s)</Text>
            </View>
          ))}

          <Text style={styles.subtitulo}>🛒 Pedidos</Text>
          {pedidos.map((ped, index) => (
            <View key={index} style={styles.card}>
              <Text>👤 {ped.nome} (RA: {ped.ra})</Text>
              <Text>🍽️ {ped.item} (x{ped.quantidade})</Text>
              <Text>🥤 Bebida: {ped.bebida || 'Nenhuma selecionada'}</Text>
              <Text>📝 {ped.obs || 'Sem observações'}</Text>
              <Text>Status: {ped.status || 'Pendente'}</Text>
              <Text>🕒 Feito em: {ped.dataHora || 'Data não disponível'}</Text>


              {ped.status === 'Em andamento' ? (
                <TouchableOpacity style={styles.botaoAcao} onPress={() => atualizarStatus(index, 'Concluído')}>
                  <Text style={styles.botaoTexto}>✅ Concluído</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.botaoAcao} onPress={() => atualizarStatus(index, 'Em andamento')}>
                  <Text style={styles.botaoTexto}>🍳 Em andamento</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={[styles.botaoAcao, { backgroundColor: '#e74c3c' }]} onPress={() => excluirPedido(index)}>
                <Text style={styles.botaoTexto}>❌ Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retangulo: {
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
  topo: {
    backgroundColor: '#c0392b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 12,
  },
  botoesTopo: {
    flexDirection: 'row',
    gap: 8,
  },
  botaoTopo: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  textoBotaoTopo: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  conteudo: {
    padding: 16,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  botaoAcao: {
    backgroundColor: '#2980b9',
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
