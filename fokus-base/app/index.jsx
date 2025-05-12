import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormularioReserva from './components/FormularioReserva';
import FormularioPedido from './components/FormularioPedido';

// Componente para fade-in das mensagens
const AnimatedBalao = ({ style, children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>  
      {children}
    </Animated.View>
  );
};

export default function Index() {
  const [mensagem, setMensagem] = useState('');
  const [conversas, setConversas] = useState([
    { id: '1', texto: '🍽️ Bem-vindo ao Restaurante Poliedro!', de: 'bot' },
    { id: '2', texto: 'Como posso ajudar? Use os botões rápidos ou digite sua dúvida.', de: 'bot' },
  ]);
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const router = useRouter();
  const flatListRef = useRef(null);

  // Carregar dados iniciais
  useEffect(() => {
    AsyncStorage.getItem('ultimaReserva').then(data => {
      if (data) setUltimaReserva(JSON.parse(data));
    });
    AsyncStorage.getItem('ultimoPedido').then(data => {
      if (data) setUltimoPedido(JSON.parse(data));
    });
  }, []);

  // Salvar alterações no storage
  useEffect(() => {
    AsyncStorage.setItem('ultimaReserva', JSON.stringify(ultimaReserva));
  }, [ultimaReserva]);

  useEffect(() => {
    AsyncStorage.setItem('ultimoPedido', JSON.stringify(ultimoPedido));
  }, [ultimoPedido]);

  // Scroll para fim sempre que conversas mudar
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [conversas]);

  // Após os useEffect:
const salvarReservaGlobal = async (reserva) => {
  const existentes = await AsyncStorage.getItem('todasReservas');
  const lista = existentes ? JSON.parse(existentes) : [];
  await AsyncStorage.setItem('todasReservas', JSON.stringify([...lista, reserva]));
};

const salvarPedidoGlobal = async (pedido) => {
  try {
    const pedidosExistentes = await AsyncStorage.getItem('todosPedidos');
    const lista = pedidosExistentes ? JSON.parse(pedidosExistentes) : [];
    
    const dataHora = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const atualizado = [...lista, { ...pedido, status: 'Pendente', dataHora }];

    await AsyncStorage.setItem('todosPedidos', JSON.stringify(atualizado));
  } catch (e) {
    console.log('Erro ao salvar pedido na cozinha:', e);
  }
};

  // Funções de envio e respostas
  const enviarMensagem = texto => {
    const msg = texto?.trim() || mensagem.trim();
    if (!msg) return;
    const cliente = { id: Date.now().toString(), texto: msg, de: 'cliente' };
    const bot = { id: (Date.now()+1).toString(), texto: 'Mensagem recebida! 🍽️', de: 'bot' };
    setConversas(prev => [...prev, cliente, bot]);
    setMensagem('');
  };

  const responderCardapio = () => {
    const pergunta = { id: Date.now().toString(), texto: 'Quero ver o cardápio!', de: 'cliente' };
    const resposta = {
      id: (Date.now()+1).toString(),
      texto: `🍽️ Nosso Cardápio

Pratos Principais
Filé de Frango Grelhado – R$ 28,99
Linguiça Toscana Grelhada – R$ 28,99
Linguiça Calabresa Acebolada – R$ 28,99
Nuggets de Frango – R$ 28,99

Saladas
Salada com Filé de Frango – R$ 26,99
Salada com Omelete – R$ 26,99
Salada com Atum – R$ 26,99
Salada Caesar – R$ 27,99
Salada com Kibe Vegano ou Quiche – R$ 31,99`,
      de: 'bot',
    };
    setConversas(prev => [...prev, pergunta, resposta]);
  };

  const responderHorario = () => {
    const pergunta = { id: Date.now().toString(), texto: 'Quais são os horários?', de: 'cliente' };
    const horario = {
      id: (Date.now()+1).toString(),
      texto: `🕒 Horário
Funcionamos de terça a domingo
– Almoço: 11:30 às 15:00
– Jantar: 19:00 às 23:00`,
      de: 'bot',
    };
    const endereco = {
      id: (Date.now()+2).toString(),
      texto: `📍 Rua dos Sabores, 123 – Centro
📞 (11) 1234-5678`,
      de: 'bot',
    };
    setConversas(prev => [...prev, pergunta, horario, endereco]);
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
          <Image source={require('./assets/logo.jpg')} style={styles.logo} />
          <View style={styles.centroTopo}>
            <Text style={styles.titulo}>Restaurante Poliedro</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={conversas}
          keyExtractor={item => item.id}
          style={styles.chat}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={(_, contentHeight) =>
          flatListRef.current?.scrollToOffset({ offset: contentHeight, animated: true })  
        }
          renderItem={({ item }) => {
            // Formulário de Reserva
            if (item.tipo === 'formulario' || item.tipo === 'editar-formulario') {
              return (
                <AnimatedBalao style={[styles.balao, styles.bot]}>
                  <FormularioReserva
                    reservaInicial={item.tipo === 'editar-formulario' ? ultimaReserva : { nome:'',data:'',horario:'',pessoas:'',telefone:'',obs:'' }}
                    onConfirmar={reserva => {
                      setUltimaReserva(reserva);
                      salvarReservaGlobal(reserva); // <-- aqui adiciona
                      setConversas(prev => [...prev, { id:Date.now().toString(), tipo:'opcoes-reserva', de:'bot' }]);
                    }}

                  />
                </AnimatedBalao>
              );
            }
            // Formulário de Pedido
            if (item.tipo === 'pedido') {
              return (
                <AnimatedBalao style={[styles.balao, styles.bot]}>
                  <FormularioPedido
                    onConfirmar={pedido => {
                     setUltimoPedido(pedido);
                      salvarPedidoGlobal(pedido); // <-- aqui adiciona
                      setConversas(prev => [...prev, { id:Date.now().toString(), tipo:'opcoes-pedido', de:'bot' }]);
                        }}

                  />
                </AnimatedBalao>
              );
            }
            // Opções Reserva
           if (item.tipo === 'opcoes-reserva' && ultimaReserva) {
  return (
    <AnimatedBalao style={[styles.balao, styles.bot]}>
      <Text style={styles.textoBot}>
        📋 <Text style={{ fontWeight:'bold' }}>Sua Reserva</Text>
        {'\n'}Status: confirmada
        {'\n'}Nome: {ultimaReserva.nome}
        {'\n'}Data: {ultimaReserva.data} às {ultimaReserva.horario}
        {'\n'}Pessoas: {ultimaReserva.pessoas}
        {'\n'}Telefone: {ultimaReserva.telefone}
        {'\n'}Obs.: {ultimaReserva.obs || 'Nenhuma'}
      </Text>
      <View style={styles.opcoesRow}>
        <TouchableOpacity
          style={styles.cancelarBtn}
          onPress={async () => {
            setUltimaReserva(null);
            await AsyncStorage.removeItem('ultimaReserva');

            // Remover também do painel da cozinha
            const todas = await AsyncStorage.getItem('todasReservas');
            if (todas) {
              const lista = JSON.parse(todas);
              const novaLista = lista.filter(
                r => r.telefone !== ultimaReserva.telefone || r.data !== ultimaReserva.data
              );
              await AsyncStorage.setItem('todasReservas', JSON.stringify(novaLista));
            }

            setConversas(prev => [
              ...prev,
              { id: Date.now().toString(), texto: '❌ Reserva cancelada com sucesso.', de: 'bot' },
            ]);
          }}
        >
          <Text style={styles.cancelarTexto}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.alterarBtn}
          onPress={() =>
            setConversas(prev => [
              ...prev,
              { id: Date.now().toString(), tipo: 'editar-formulario', de: 'bot' },
            ])
          }
        >
          <Text style={styles.alterarTexto}>Alterar</Text>
        </TouchableOpacity>
      </View>
    </AnimatedBalao>
  );
}
            // Opções Pedido
            if (item.tipo === 'opcoes-pedido' && ultimoPedido) {
              return (
                <AnimatedBalao style={[styles.balao, styles.bot]}>
                  <Text style={styles.textoBot}>
                    📦 <Text style={{ fontWeight:'bold' }}>Pedido Atual</Text>
                    {'\n'}Cliente: {ultimoPedido.nome}
                    {'\n'}RA: {ultimoPedido.ra}
                    {'\n'}Item: {ultimoPedido.item}
                    {'\n'}Qtd: {ultimoPedido.quantidade}
                    {'\n'}Obs.: {ultimoPedido.obs||'Nenhuma'}
                    {'\n'}Bebida: {ultimoPedido.bebida || 'Nenhuma selecionada'}
                  </Text>
                  <View style={styles.opcoesRow}>
                    <TouchableOpacity style={styles.cancelarBtn} onPress={() => {
                      setUltimoPedido(null);
                      setConversas(prev => [...prev, { id:Date.now().toString(), texto:'❌ Pedido cancelado.', de:'bot' }]);
                    }}>
                      <Text style={styles.cancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.alterarBtn} onPress={() => setConversas(prev => [...prev, { id:Date.now().toString(), tipo:'editar-pedido', de:'bot' }])}>
                      <Text style={styles.alterarTexto}>Alterar</Text>
                    </TouchableOpacity>
                  </View>
                </AnimatedBalao>
              );
            }
            // Editar Pedido
            if (item.tipo === 'editar-pedido') {
              return (
                <AnimatedBalao style={[styles.balao, styles.bot]}>
                  <FormularioPedido
                    pedidoInicial={ultimoPedido}
                    onConfirmar={pedido => {
                      setUltimoPedido(pedido);
                      setConversas(prev => [...prev, { id:Date.now().toString(), texto:`🔄 Pedido atualizado! Item: ${pedido.item} x${pedido.quantidade}`, de:'bot' }]);
                    }}
                  />
                </AnimatedBalao>
              );
            }
            // Mensagens padrão
            return (
              <AnimatedBalao style={[styles.balao, item.de==='cliente'?styles.cliente:styles.bot]}>
                <Text style={item.de==='cliente'?styles.textoCliente:styles.textoBot}>{item.texto}</Text>
              </AnimatedBalao>
            );
          }}
        />

        {/* Entrada de texto */}
        <View style={styles.envio}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#888"
            value={mensagem}
            onChangeText={setMensagem}
            onSubmitEditing={() => enviarMensagem()}
          />
          <TouchableOpacity style={styles.botaoEnviar} onPress={() => enviarMensagem()}>
            <Text style={styles.seta}>➤</Text>
          </TouchableOpacity>
        </View>

        {/* Botões rápidos */}
       {/* Botões rápidos */}
<View style={styles.botoesRodape}>
  {[
    { label: '🍽️ Cardápio', onPress: responderCardapio },
    { label: '🕒 Horários', onPress: responderHorario },
    {
      label: '📅 Reservar',
      onPress: () =>
        setConversas((prev) => [
          ...prev,
          { id: Date.now().toString(), tipo: 'formulario', de: 'bot' },
        ]),
    },
    {
      label: '📋 Ver Reserva',
      onPress: () => {
        if (ultimaReserva) {
          setConversas((prev) => [
            ...prev,
            { id: Date.now().toString(), tipo: 'opcoes-reserva', de: 'bot' },
          ]);
        } else {
          setConversas((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              texto: '📋 Você não tem reservas ativas. Deseja fazer uma?',
              de: 'bot',
            },
          ]);
        }
      },
    },
    {
      label: '🛒 Fazer Pedido',
      onPress: () =>
        setConversas((prev) => [
          ...prev,
          { id: Date.now().toString(), tipo: 'pedido', de: 'bot' },
        ]),
    },
    {
      label: '📦 Ver Pedido',
      onPress: () => {
        if (ultimoPedido) {
          setConversas((prev) => [
            ...prev,
            { id: Date.now().toString(), tipo: 'opcoes-pedido', de: 'bot' },
          ]);
        } else {
          setConversas((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              texto: '📦 Você não tem pedidos ativos. Deseja fazer um?',
              de: 'bot',
            },
          ]);
        }
      },
    },
  ].map((btn) => (
    <TouchableOpacity key={btn.label} style={styles.botaoRodape} onPress={btn.onPress}>
      <Text style={styles.botaoTextoRodape}>{btn.label}</Text>
    </TouchableOpacity>
  ))}
</View>

        {/* Acesso Cozinha */}
        <View style={styles.acessoRodape}>
          <TouchableOpacity style={styles.botaoRodape} onPress={()=>router.push('/acesso-cozinha')}>
            <Text style={styles.botaoTextoRodape}>🔒 Acesso Cozinha</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// Estilos
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center'},
  retangulo:{backgroundColor:'#fff',width:'90%',maxWidth:400,aspectRatio:9/16,borderRadius:16,shadowColor:'#000',shadowOpacity:0.2,shadowOffset:{width:0,height:2},shadowRadius:8,elevation:5,overflow:'hidden'},
  topo:{backgroundColor:'#c0392b',flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:10,borderBottomWidth:1,borderColor:'#b03a2e'},
  centroTopo:{flex:1,alignItems:'center',marginRight:40},
  titulo:{fontSize:16,fontWeight:'bold',color:'#fff'},
  logo:{width:40,height:40,resizeMode:'cover',borderRadius:20,borderWidth:2,borderColor:'#fff'},
  chat:{flex:1,backgroundColor:'#f8f8f8'},
  balao:{padding:12,marginVertical:5,borderRadius:14,maxWidth:'80%',shadowColor:'#000',shadowOpacity:0.05,shadowOffset:{width:0,height:1},shadowRadius:2,elevation:2},
  cliente:{backgroundColor:'#3498db',alignSelf:'flex-end'},
  bot:{backgroundColor:'#fff',alignSelf:'flex-start'},
  textoCliente:{fontSize:15,color:'#fff',textShadowColor:'rgba(0,0,0,0.2)',textShadowOffset:{width:1,height:1},textShadowRadius:1},
  textoBot:{fontSize:15,color:'#000',textShadowColor:'rgba(0,0,0,0.1)',textShadowOffset:{width:1,height:1},textShadowRadius:1},
  envio:{flexDirection:'row',padding:10,borderTopWidth:1,borderColor:'#ddd',backgroundColor:'#fff'},
  input:{flex:1,borderColor:'#ccc',borderWidth:1,borderRadius:20,paddingHorizontal:12,height:40},
  botaoEnviar:{justifyContent:'center',alignItems:'center',padding:10,backgroundColor:'#c0392b',borderRadius:20,marginLeft:8},
  seta:{fontSize:18,color:'#fff',fontWeight:'bold'},
  botoesRodape:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',backgroundColor:'#fff',paddingVertical:10,paddingHorizontal:5},
  botaoRodape:{backgroundColor:'#c0392b',paddingVertical:10,paddingHorizontal:8,margin:6,borderRadius:25,width:'30%',alignItems:'center',justifyContent:'center'},
  botaoTextoRodape:{fontSize:13,color:'#fff',fontWeight:'600',textAlign:'center',lineHeight:16},
  acessoRodape:{alignItems:'center',paddingBottom:10,backgroundColor:'#fff'},
  cancelarBtn:{backgroundColor:'#e74c3c',paddingVertical:8,paddingHorizontal:16,borderRadius:20},
  cancelarTexto:{color:'#fff',fontWeight:'bold'},
  alterarBtn:{backgroundColor:'#e67e22',paddingVertical:8,paddingHorizontal:16,borderRadius:20,marginLeft:8},
  alterarTexto:{color:'#fff',fontWeight:'bold'},
  opcoesRow:{flexDirection:'row',marginTop:10},
});
