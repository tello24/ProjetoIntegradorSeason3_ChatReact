// index.jsx com suporte completo para alterar e cancelar pedidos e reservas

import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormularioReserva from './components/FormularioReserva';
import FormularioPedido from './components/FormularioPedido';

export default function Index() {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState([
    {
      id: '1',
      texto: '🍽️ Bem-vindo ao Restaurante Poliedro!',
      de: 'bot',
    },
    {
      id: '2',
      texto: 'Como posso ajudar? Use os botões rápidos ou digite sua dúvida.',
      de: 'bot',
    },
  ]);
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const carregarReserva = async () => {
      const reservaSalva = await AsyncStorage.getItem('ultimaReserva');
      if (reservaSalva) setUltimaReserva(JSON.parse(reservaSalva));
    };
    carregarReserva();
  }, []);

  useEffect(() => {
    const carregarPedido = async () => {
      const pedidoSalvo = await AsyncStorage.getItem('ultimoPedido');
      if (pedidoSalvo) setUltimoPedido(JSON.parse(pedidoSalvo));
    };
    carregarPedido();
  }, []);
  


  useEffect(() => {
    AsyncStorage.setItem('ultimaReserva', JSON.stringify(ultimaReserva));
  }, [ultimaReserva]);

  useEffect(() => {
    AsyncStorage.setItem('ultimoPedido', JSON.stringify(ultimoPedido));
  }, [ultimoPedido]);
  

  const enviarMensagem = (texto = mensagem) => {
    if (texto.trim() === '') return;
    const novaMensagem = { id: Date.now().toString(), texto, de: 'cliente' };
    const respostaBot = {
      id: (Date.now() + 1).toString(),
      texto: 'Mensagem recebida! 🍽️',
      de: 'bot',
    };
    setConversas((prev) => [...prev, novaMensagem, respostaBot]);
    setMensagem('');
  };

  const responderCardapio = () => {
    const pergunta = {
      id: Date.now().toString(),
      texto: 'Quero ver o cardápio!',
      de: 'cliente',
    };
    const resposta = {
      id: (Date.now() + 1).toString(),
      texto: `🍽️ Nosso Cardápio\nPratos Principais\nFilé de Frango Grelhado – R$ 28,99\nLinguiça Toscana Grelhada – R$ 28,99\nLinguiça Calabresa Acebolada – R$ 28,99\nNuggets de Frango – R$ 28,99\n------------------ – ------------------\nSaladas\nSalada com Filé de Frango – R$ 26,99\nSalada com Omelete – R$ 26,99\nSalada com Atum – R$ 26,99\nSalada Caesar – R$ 27,99\nSalada com Kibe Vegano ou Quiche – R$ 31,99`,
      de: 'bot',
    };
    setConversas((prev) => [...prev, pergunta, resposta]);
  };

  const responderHorario = () => {
    const pergunta = {
      id: Date.now().toString(),
      texto: 'Quais são os horários?',
      de: 'cliente',
    };
    const horario = {
      id: (Date.now() + 1).toString(),
      texto: `🕒 Horário:\nFuncionamos de terça a domingo:\n– Almoço: 11:30 às 15:00\n– Jantar: 19:00 às 23:00`,
      de: 'bot',
    };
    const endereco = {
      id: (Date.now() + 2).toString(),
      texto: `📍 Rua dos Sabores, 123 – Centro\n📞 (11) 1234-5678`,
      de: 'bot',
    };
    setConversas((prev) => [...prev, pergunta, horario, endereco]);
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0' }} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.retangulo}>
        <View style={styles.topo}>
          <Image source={require('./assets/logo.jpg')} style={styles.logo} />
          <View style={styles.centroTopo}>
            <Text style={styles.titulo}>Restaurante Poliedro</Text>
          </View>
        </View>

        <FlatList
          data={conversas}
          keyExtractor={(item) => item.id}
          style={styles.chat}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => {
            if (item.tipo === 'formulario' || item.tipo === 'editar-formulario') {
              return (
                <View style={[styles.balao, styles.bot]}>
                  <FormularioReserva
                    reservaInicial={item.tipo === 'editar-formulario' ? ultimaReserva : { nome: '', data: '', horario: '', pessoas: '', telefone: '', obs: '' }}
                    onConfirmar={(reserva) => {
                      setUltimaReserva(reserva);
                      setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'opcoes-reserva', de: 'bot' }]);
                    }}
                  />
                </View>
              );
            }
            if (item.tipo === 'pedido') {
              return (
                <View style={[styles.balao, styles.bot]}>
                  <FormularioPedido
                    onConfirmar={(pedido) => {
                      setUltimoPedido(pedido);
                      setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'opcoes-pedido', de: 'bot' }]);
                    }}
                  />
                </View>
              );
            }
            if (item.tipo === 'opcoes-reserva' && ultimaReserva) {
              return (
                <View style={[styles.balao, styles.bot]}>
                  <Text style={styles.textoBot}>
                    📋 <Text style={{ fontWeight: 'bold' }}>Sua Reserva</Text>{'\n'}<Text style={{ fontWeight: 'bold' }}>Status:</Text> confirmada
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Nome:</Text> {ultimaReserva.nome}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Data:</Text> {ultimaReserva.data} às {ultimaReserva.horario}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Pessoas:</Text> {ultimaReserva.pessoas}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Telefone:</Text> {ultimaReserva.telefone}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Obs.:</Text> {ultimaReserva.obs || 'Nenhuma'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setUltimaReserva(null);
                    AsyncStorage.removeItem('ultimaReserva');
                    setConversas((prev) => [...prev, { id: Date.now().toString(), texto: '❌ Reserva cancelada com sucesso.', de: 'bot' }]);
                  }} style={{ backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginTop: 12 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar Reserva</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'editar-formulario', de: 'bot' }]);
                  }} style={{ backgroundColor: '#e67e22', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginTop: 6 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Alterar Reserva</Text>
                  </TouchableOpacity>
                </View>
              );
            }
            if (item.tipo === 'opcoes-pedido' && ultimoPedido) {
              return (
                <View style={[styles.balao, styles.bot]}>
                  <Text style={styles.textoBot}>
                    📦 <Text style={{ fontWeight: 'bold' }}>Pedido Atual</Text>{'\n'}<Text style={{ fontWeight: 'bold' }}>Cliente:</Text> {ultimoPedido.nome}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>RA:</Text> {ultimoPedido.ra}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Item:</Text> {ultimoPedido.item}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Quantidade:</Text> {ultimoPedido.quantidade}
                    {'\n'}<Text style={{ fontWeight: 'bold' }}>Obs.:</Text> {ultimoPedido.obs || 'Nenhuma'}
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setUltimoPedido(null);
                    setConversas((prev) => [...prev, { id: Date.now().toString(), texto: '❌ Pedido cancelado com sucesso.', de: 'bot' }]);
                  }} style={{ backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginTop: 12 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar Pedido</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'editar-pedido', de: 'bot' }]);
                  }} style={{ backgroundColor: '#e67e22', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginTop: 6 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Alterar Pedido</Text>
                  </TouchableOpacity>
                </View>
              );
            }
            if (item.tipo === 'editar-pedido') {
              return (
                <View style={[styles.balao, styles.bot]}>
                  <FormularioPedido
                    pedidoInicial={ultimoPedido}
                    onConfirmar={(pedido) => {
                      setUltimoPedido(pedido);
                      setConversas((prev) => [...prev, {
                        id: Date.now().toString(),
                        texto: `🔄 Pedido atualizado!\nCliente: ${pedido.nome}\nRA: ${pedido.ra}\nItem: ${pedido.item} (x${pedido.quantidade})\nObs: ${pedido.obs || 'Nenhuma'}`,
                        de: 'bot'
                      }]);
                    }}
                  />
                </View>
              );
            }
            return (
              <View style={[styles.balao, item.de === 'cliente' ? styles.cliente : styles.bot]}>
                <Text style={item.de === 'cliente' ? styles.textoCliente : styles.textoBot}>{item.texto}</Text>
              </View>
            );
          }}
        />

        <View style={styles.envio}>
          <TextInput style={styles.input} placeholder="Digite sua mensagem..." placeholderTextColor="#888" value={mensagem} onChangeText={setMensagem} />
          <TouchableOpacity style={styles.botaoEnviar} onPress={() => enviarMensagem()}>
            <Text style={styles.seta}>➤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.botoesRodape}>
          {[
            { label: '🍽️ Cardápio', onPress: responderCardapio },
            { label: '🕒 Horários', onPress: responderHorario },
            { label: '📅 Reservar', onPress: () => setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'formulario', de: 'bot' }]) },
            { label: '📋 Ver Reserva', onPress: () => ultimaReserva ? setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'opcoes-reserva', de: 'bot' }]) : alert('Nenhuma reserva feita ainda, meu lorde!') },
            { label: '🛒 Fazer Pedido', onPress: () => setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'pedido', de: 'bot' }]) },
            { label: '📦 Ver Pedido', onPress: () => ultimoPedido ? setConversas((prev) => [...prev, { id: Date.now().toString(), tipo: 'opcoes-pedido', de: 'bot' }]) : alert('Nenhum pedido encontrado, meu lorde!') },
          ].map((btn) => (
            <TouchableOpacity key={btn.label} style={styles.botaoRodape} onPress={btn.onPress}>
              <Text style={styles.botaoTextoRodape}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.acessoRodape}>
  <TouchableOpacity style={styles.botaoRodape} onPress={() => router.push('/acesso-cozinha')}>
    <Text style={styles.botaoTextoRodape}>🔒 Acesso Cozinha</Text>
  </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#b03a2e',
  },
  centroTopo: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chat: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  balao: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 14,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  cliente: {
    backgroundColor: '#3498db',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  textoCliente: {
    fontSize: 15,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  textoBot: {
    fontSize: 15,
    color: '#000',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  envio: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  botaoEnviar: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#c0392b',
    borderRadius: 20,
    marginLeft: 8,
  },
  seta: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  botoesRodape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  botaoRodape: {
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 8,
    margin: 6,
    borderRadius: 25,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTextoRodape: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  acessoRodape: {
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
});

