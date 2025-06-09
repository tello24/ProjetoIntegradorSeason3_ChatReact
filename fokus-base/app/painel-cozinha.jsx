// app/painel-cozinha.jsx atualizado com botões de status dos pedidos

import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { PEDIDO_GET_URL } from './utils/config';
import { MaterialIcons } from '@expo/vector-icons';


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

  const carregarPedidos = async () => {
  try {
    const resPedidos = await fetch(PEDIDO_GET_URL);
    const jsonPedidos = await resPedidos.json();
    setPedidos(jsonPedidos);

    const dadosReservas = await AsyncStorage.getItem('todasReservas');
    if (dadosReservas) setReservas(JSON.parse(dadosReservas));
  } catch (e) {
    console.log('❌ Erro ao carregar dados da cozinha:', e);
  }
};


  useEffect(() => {
    carregarPedidos();
  const carregarDados = async () => {
    try {
      const resPedidos = await fetch(PEDIDO_GET_URL);
      const jsonPedidos = await resPedidos.json();
      setPedidos(jsonPedidos); // agora pega direto do MongoDB

      const dadosReservas = await AsyncStorage.getItem('todasReservas');
      if (dadosReservas) setReservas(JSON.parse(dadosReservas));
    } catch (e) {
      console.log('❌ Erro ao buscar dados:', e);
    }
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

const excluirReserva = async (index) => {
  const atualizadas = reservas.filter((_, i) => i !== index);
  setReservas(atualizadas);
  await AsyncStorage.setItem('todasReservas', JSON.stringify(atualizadas));

  // Se for a reserva exibida no chat, remove também
  const ultima = await AsyncStorage.getItem('ultimaReserva');
  if (ultima) {
    const reservaExcluida = reservas[index];
    const reservaSalva = JSON.parse(ultima);
    if (
      reservaExcluida?.nome === reservaSalva?.nome &&
      reservaExcluida?.data === reservaSalva?.data
    ) {
      await AsyncStorage.removeItem('ultimaReserva');
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
            <TouchableOpacity style={styles.botaoTopo} onPress={() => router.push('/editar-cardapio')}>
              <Text style={styles.textoBotaoTopo}>Editar Cardápio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoTopo} onPress={() => router.replace('/')}> 
              <Text style={styles.textoBotaoTopo}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={carregarPedidos} style={styles.botaoRecarregar}>
  <MaterialIcons name="refresh" size={24} color="#fff" />
</TouchableOpacity>

          </View>
        </View>

        <ScrollView contentContainerStyle={styles.conteudo}>
          {/* <Text style={styles.subtitulo}></Text> */}
          {reservas.map((res, index) => (
  <View key={index} style={styles.card}>
    <Text>👤 {res.nome}</Text>
    <Text>📅 {res.data} às {res.horario}</Text>
    <Text>👥 {res.pessoas} pessoa(s)</Text>

    <TouchableOpacity
      style={[styles.botaoAcao, { backgroundColor: '#e74c3c' }]}
      onPress={() => excluirReserva(index)}
    >
      <Text style={styles.botaoTexto}>❌ Excluir</Text>
    </TouchableOpacity>
  </View>
))}


          <Text style={styles.subtitulo}>🛒 Pedidos</Text>
          {pedidos.map((ped, index) => (
            <View key={index} style={styles.card}>
              <Text>
            👤 {ped.nome}
            {ped.ra ? ` (RA: ${ped.ra})` : ''}
              </Text>

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
    backgroundColor: '#16C1D7',
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
    backgroundColor: '#2ecc71',
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoRecarregar: {
  borderColor: '#FFF',
  borderWidth: 1,
  borderRadius: 8,
  paddingVertical: 3,
  alignItems: 'center',
},

});
