import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL, CARDAPIO_URL, PEDIDO_URL } from "./utils/config";
import BalaoPedidoComTempo from "./components/BalaoPedidoComTempo";
import { CANCELAR_PEDIDO_URL } from './utils/config';


import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  useWindowDimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
// import FormularioReserva from './components/FormularioReserva';
import FormularioPedido from "./components/FormularioPedido";

//
// Função 1: Busca TODOS os pedidos no backend
const buscarId = async () => {
  try {
    const response = await fetch(PEDIDO_URL, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.status}`);
    }
    const pedidoRecebido = await response.json();
    return pedidoRecebido;
  } catch (err) {
    console.error("Erro em buscarId:", err);
    return null;
  }
};

// Função 2: Pega o resultado da busca e extrai o ID do PRIMEIRO pedido
const pedidosIds = async () => {
  const dadosDoPedido = await buscarId();
  if (dadosDoPedido && dadosDoPedido.length > 0) {
    const primeiroPedido = dadosDoPedido[0];
    const ultimoPedidoId = primeiroPedido._id;
    return ultimoPedidoId;
  } else {
    console.log("Nenhum pedido retornado pela busca.");
    return null;
  }
};

// Função 3: Recebe um ID e manda a requisição DELETE para o backend
const apagarPedido = async (id) => {
  if (!id) {
    console.error("❌ apagarPedido foi chamado com um ID indefinido.");
    return;
  }

  const url = `${CANCELAR_PEDIDO_URL}/${id}`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("⚠️ Falha ao apagar o pedido no servidor.");
    }

    const resultado = await response.json();
    console.log("✅ Resposta do servidor:", resultado.mensagem);
  } catch (error) {
    console.error("❌ Ocorreu um erro na função apagarPedido:", error);
  }
};


// >>> Função 4: A "Orquestradora" que une tudo <<<
// É ESTA FUNÇÃO QUE SEU BOTÃO DEVE CHAMAR!
const handleApagarUltimoPedido = async () => {
    console.log("Iniciando processo para apagar último pedido...");
    const idParaApagar = await pedidosIds(); // Pega o ID
    if (idParaApagar) {
        await apagarPedido(idParaApagar); // Usa o ID para apagar
    } else {
        console.log("Processo cancelado: nenhum ID de pedido foi encontrado.");
    }
};

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
  const [hovered, setHovered] = useState(null);
  const [cardapio, setCardapio] = useState([]);
  const esperandoConfirmacao = useRef(null);
  const dataHoraCriacao = new Date().toISOString();
  const [mensagem, setMensagem] = useState("");
  const [conversas, setConversas] = useState([
    { id: "1", texto: "🍽️ Bem-vindo ao Restaurante Poliedro!", de: "bot" },
    {
      id: "2",
      texto: "Como posso ajudar? Use os botões rápidos ou digite sua dúvida.",
      de: "bot",
    },
  ]);
  // const [ultimaReserva, setUltimaReserva] = useState(null);
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const router = useRouter();
  const flatListRef = useRef(null);

  // responsivdidade
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const dynamicStyle = isWeb
    ? {
        width: Math.min(width * 0.98, 1600),
        height: Math.min(height * 0.98, 1200),
      }
    : {
        width: width * 0.9,
        height: height * 0.8,
      };

  // Carregar dados iniciais
  // useEffect(() => {
  //   AsyncStorage.getItem('ultimaReserva').then(data => {
  //     if (data) setUltimaReserva(JSON.parse(data));
  //   });
  //   AsyncStorage.getItem('ultimoPedido').then(data => {
  //     if (data) setUltimoPedido(JSON.parse(data));
  //   });
  // }, []);

  // Salvar alterações no storage
  // useEffect(() => {
  //   AsyncStorage.setItem('ultimaReserva', JSON.stringify(ultimaReserva));
  // }, [ultimaReserva]);

  useEffect(() => {
    AsyncStorage.setItem("ultimoPedido", JSON.stringify(ultimoPedido));
  }, [ultimoPedido]);

  // Scroll para fim sempre que conversas mudar
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [conversas]);

  useEffect(() => {
    const carregarPedidoSalvo = async () => {
      const ra = await AsyncStorage.getItem("ra");
      if (!ra) return;

      try {
        const resp = await fetch(`${PEDIDO_URL}/${ra}`);
        if (!resp.ok) return;

        const pedidoSalvo = await resp.json();
        setUltimoPedido(pedidoSalvo);

        setConversas((prev) => [
          ...prev,
          { id: Date.now().toString(), tipo: "opcoes-pedido", de: "bot" },
        ]);
      } catch (e) {
        console.error("❌ Erro ao carregar pedido salvo:", e);
      }
    };

    carregarPedidoSalvo();
  }, []);

  // Após os useEffect:
  // const salvarReservaGlobal = async (reserva) => {
  //   const existentes = await AsyncStorage.getItem('todasReservas');
  //   const lista = existentes ? JSON.parse(existentes) : [];
  //   await AsyncStorage.setItem('todasReservas', JSON.stringify([...lista, reserva]));
  // };

  useEffect(() => {
  const carregarCardapio = async () => {
    try {
      const res = await fetch(CARDAPIO_URL);
      const data = await res.json();

      if (Array.isArray(data)) {
        setCardapio(data.flatMap((cat) => cat.itens || []));
      } else if (Array.isArray(data.categorias)) {
        setCardapio(data.categorias.flatMap((cat) => cat.itens || []));
      } else {
        console.warn("⚠️ Formato de cardápio inesperado:", data);
      }
    } catch (err) {
      console.error("❌ Erro ao carregar cardápio:", err);
      setCardapio([]);
    }
  };

  carregarCardapio();
}, []);


  const salvarPedidoGlobal = async (pedido) => {
    try {
      const pedidosExistentes = await AsyncStorage.getItem("todosPedidos");
      const lista = pedidosExistentes ? JSON.parse(pedidosExistentes) : [];

      const dataHora = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const atualizado = [
        ...lista,
        { ...pedido, status: "Pendente", dataHora },
      ];

      await AsyncStorage.setItem("todosPedidos", JSON.stringify(atualizado));
    } catch (e) {
      console.log("Erro ao salvar pedido na cozinha:", e);
    }
  };

  const enviarMensagem = (textoDigitado) => {
    const msg =
      textoDigitado?.trim().toLowerCase() || mensagem.trim().toLowerCase();
    if (!msg) return;

    const cliente = { id: Date.now().toString(), texto: msg, de: "cliente" };
    setConversas((prev) => [...prev, cliente]);

    // Verifica confirmação pendente
    if (msg === "sim" && esperandoConfirmacao.current) {
      const tipo = esperandoConfirmacao.current;
      esperandoConfirmacao.current = null;

      // if (tipo === 'reserva') {
      //   setConversas(prev => [
      //     ...prev,
      //     { id: Date.now().toString(), tipo: 'formulario', de: 'bot' },
      //   ]);
      // }

      if (tipo === "pedido") {
        setConversas((prev) => [
          ...prev,
          { id: Date.now().toString(), tipo: "pedido", de: "bot" },
        ]);
      }

      setMensagem("");
      return;
    }

    const comandos = Object.keys(comandosReconhecidos);
    const semelhante = encontrarComandoSemelhante(msg, comandos);

    if (semelhante && typeof comandosReconhecidos[semelhante] === "function") {
      comandosReconhecidos[semelhante]();
    } else {
      const respostaPadrao = {
        id: (Date.now() + 1).toString(),
        texto:
          "Desculpe, não entendi o que você quis dizer. Pode tentar novamente?",
        de: "bot",
      };
      setConversas((prev) => [...prev, respostaPadrao]);
    }

    setMensagem("");
  };

  const responderCardapio = async () => {
    const pergunta = {
      id: Date.now().toString(),
      texto: "Quero ver o cardápio!",
      de: "cliente",
    };
    setConversas((prev) => [...prev, pergunta]);

    try {
      const res = await fetch(CARDAPIO_URL);
      const data = await res.json();

      const categorias = Array.isArray(data) ? data : data.categorias || [];

      if (!categorias.length) {
        const msg = {
          id: (Date.now() + 1).toString(),
          texto: "📭 Cardápio indisponível no momento.",
          de: "bot",
        };
        return setConversas((prev) => [...prev, msg]);
      }

      const respostaFormatada = categorias
        .map((cat) => {
          const itensFormatados = cat.itens
            .map((i) => `• ${i.nome} – R$ ${i.preco.toFixed(2)}`)
            .join("\n");
          return ` ${cat.nome}\n${itensFormatados}`;
        })
        .join("\n\n");

      const resposta = {
        id: (Date.now() + 2).toString(),
        texto: `🍽️ Nosso Cardápio\n\n${respostaFormatada}`,
        de: "bot",
      };

      setConversas((prev) => [...prev, resposta]);
    } catch (err) {
      console.error("❌ Erro ao carregar cardápio:", err);
      const erro = {
        id: (Date.now() + 3).toString(),
        texto: "❌ Erro ao carregar o cardápio. Tente novamente mais tarde.",
        de: "bot",
      };
      setConversas((prev) => [...prev, erro]);
    }
  };

  const responderHorario = () => {
    const pergunta = {
      id: Date.now().toString(),
      texto: "Quais são os horários?",
      de: "cliente",
    };
    const horario = {
      id: (Date.now() + 1).toString(),
      texto: `🕒 Horário
Funcionamos de terça a domingo
– Almoço: 11:30 às 15:00
– Jantar: 19:00 às 23:00`,
      de: "bot",
    };
    const endereco = {
      id: (Date.now() + 2).toString(),
      texto: `📍 Rua dos Sabores, 123 – Centro
📞 (11) 1234-5678`,
      de: "bot",
    };
    setConversas((prev) => [...prev, pergunta, horario, endereco]);
  };

  const comandosReconhecidos = {
    "ver cardapio": responderCardapio,
    "fazer pedido": () =>
      setConversas((prev) => [
        ...prev,
        { id: Date.now().toString(), tipo: "pedido", de: "bot" },
      ]),

    "ver pedido": () => {
      if (ultimoPedido) {
        setConversas((prev) => [
          ...prev,
          { id: Date.now().toString(), tipo: "opcoes-pedido", de: "bot" },
        ]);
      } else {
        setConversas((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            texto: "📦 Você não tem pedidos ativos. Deseja fazer um?",
            de: "bot",
          },
        ]);
        esperandoConfirmacao.current = "pedido";
      }
    },

    // 'ver reserva': () => {
    //   if (ultimaReserva) {
    //     setConversas((prev) => [
    //       ...prev,
    //       { id: Date.now().toString(), tipo: 'opcoes-reserva', de: 'bot' },
    //     ]);
    //   } else {
    //     setConversas((prev) => [
    //       ...prev,
    //       {
    //         id: Date.now().toString(),
    //         texto: '📋 Você não tem reservas ativas. Deseja fazer uma?',
    //         de: 'bot',
    //       },
    //     ]);
    //     esperandoConfirmacao.current = 'reserva';
    //   }
    // },

    horarios: responderHorario,
    // 'reservar': () =>
    //   setConversas((prev) => [
    //     ...prev,
    //     { id: Date.now().toString(), tipo: 'formulario', de: 'bot' },
    //   ]),
  };

  function encontrarComandoSemelhante(input, comandos) {
    input = input.toLowerCase();
    let melhor = null;
    let melhorPontuacao = 0;

    for (const comando of comandos) {
      const palavrasComando = comando.toLowerCase().split(" ");
      let pontuacao = palavrasComando.reduce((score, palavra) => {
        return score + (input.includes(palavra.slice(0, 4)) ? 1 : 0);
      }, 0);

      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        melhor = comando;
      }
    }

    return melhorPontuacao > 0 ? melhor : null;
  }

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      }}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={[styles.retangulo, dynamicStyle]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.topoCurvo]}>
          <TouchableOpacity
            style={styles.logoutBotao}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCentro}>
            <Image source={require("./assets/logo.jpg")} style={styles.logo} />
            <Text style={styles.titulo}>Restaurante Poliedro</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={conversas}
          keyExtractor={(item) => item.id}
          style={[styles.chat]}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={(_, contentHeight) =>
            flatListRef.current?.scrollToOffset({
              offset: contentHeight,
              animated: true,
            })
          }
          renderItem={({ item }) => {
            // Formulário de Reserva
            // if (item.tipo === 'formulario' || item.tipo === 'editar-formulario') {
            //   return (
            //     <AnimatedBalao style={[styles.balao, styles.bot]}>
            //       <FormularioReserva
            //         reservaInicial={item.tipo === 'editar-formulario' ? ultimaReserva : { nome:'',data:'',horario:'',pessoas:'',telefone:'',obs:'' }}
            //         onConfirmar={reserva => {
            //           setUltimaReserva(reserva);
            //           salvarReservaGlobal(reserva); // <-- aqui adiciona
            //           setConversas(prev => [...prev, { id:Date.now().toString(), tipo:'opcoes-reserva', de:'bot' }]);
            //         }}

            //       />
            //     </AnimatedBalao>
            //   );
            // }
            // Formulário de Pedido
            if (item.tipo === "pedido") {
              return (
                <AnimatedBalao style={[styles.balao, styles.bot]}>
                  <FormularioPedido
                    onConfirmar={(pedido) => {
                      const dataHoraCriacao = new Date().toISOString();
                      const pedidoComData = {
                        ...pedido,
                        criadoEm: dataHoraCriacao,
                      };

                      setUltimoPedido(pedidoComData);
                      salvarPedidoGlobal(pedidoComData);
                      setConversas((prev) => {
                        const semForm = prev.filter((i) => i.tipo !== "pedido");
                        return [
                          ...semForm,
                          {
                            id: (Date.now() + 1).toString(),
                            texto: pedido.resumo,
                            de: "bot",
                          },
                        ];
                      });
                    }}
                  />
                </AnimatedBalao>
              );
            }

            // Opções Reserva
            //            if (item.tipo === 'opcoes-reserva' && ultimaReserva) {
            //   return (
            //     <AnimatedBalao style={[styles.balao, styles.bot]}>
            //       <Text style={styles.textoBot}>
            //         📋 <Text style={{ fontWeight:'bold' }}>Sua Reserva</Text>
            //         {'\n'}Status: confirmada
            //         {'\n'}Nome: {ultimaReserva.nome}
            //         {'\n'}Data: {ultimaReserva.data} às {ultimaReserva.horario}
            //         {'\n'}Pessoas: {ultimaReserva.pessoas}
            //         {'\n'}Telefone: {ultimaReserva.telefone}
            //         {'\n'}Obs.: {ultimaReserva.obs || 'Nenhuma'}
            //       </Text>
            //       <View style={styles.opcoesRow}>
            //         <TouchableOpacity
            //           style={styles.cancelarBtn}
            //           onPress={async () => {
            //             setUltimaReserva(null);
            //             await AsyncStorage.removeItem('ultimaReserva');

            //             // Remover também do painel da cozinha
            //             const todas = await AsyncStorage.getItem('todasReservas');
            //             if (todas) {
            //               const lista = JSON.parse(todas);
            //               const novaLista = lista.filter(
            //                 r => r.telefone !== ultimaReserva.telefone || r.data !== ultimaReserva.data
            //               );
            //               await AsyncStorage.setItem('todasReservas', JSON.stringify(novaLista));
            //             }

            //             setConversas(prev => [
            //               ...prev,
            //               { id: Date.now().toString(), texto: '❌ Reserva cancelada com sucesso.', de: 'bot' },
            //             ]);
            //           }}
            //         >
            //           <Text style={styles.cancelarTexto}>Cancelar</Text>
            //         </TouchableOpacity>

            //         <TouchableOpacity
            //           style={styles.alterarBtn}
            //           onPress={() =>
            //             setConversas(prev => [
            //               ...prev,
            //               { id: Date.now().toString(), tipo: 'editar-formulario', de: 'bot' },
            //             ])
            //           }
            //         >
            //           <Text style={styles.alterarTexto}>Alterar</Text>
            //         </TouchableOpacity>
            //       </View>
            //     </AnimatedBalao>
            //   );
            // }
            // Opções Pedido
            if (item.tipo === "opcoes-pedido" && ultimoPedido) {
              return (
                <BalaoPedidoComTempo
                  pedido={ultimoPedido}
                  onCancelar={() => {
                    handleApagarUltimoPedido();
                    setUltimoPedido(null);
                    setConversas((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        texto: "❌ Pedido cancelado.",
                        de: "bot",
                      },
                    ]);
                  }}
                  onEditar={() => {
                    setConversas((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        tipo: "editar-pedido",
                        de: "bot",
                      },
                    ]);
                  }}
                />
              );
            }
            // Editar Pedido
            if (item.tipo === "editar-pedido") {
  return (
    <AnimatedBalao style={[styles.balao, styles.bot]}>
      <FormularioPedido
        pedidoInicial={ultimoPedido}
        onConfirmar={(pedido) => {
          const dataHoraCriacao = new Date().toISOString();
          const pedidoComData = {
            ...pedido,
            criadoEm: dataHoraCriacao,
          };

          setUltimoPedido(pedidoComData);
          salvarPedidoGlobal(pedidoComData);

          // 👉 Busca preço real do banco de dados
          const itemSelecionado = cardapio.find((i) => i.nome === pedido.item);
          const precoItem = itemSelecionado ? parseFloat(itemSelecionado.preco) : 0;
          const precoBebida = pedido.bebida ? 5 : 0;

          const total =
            parseInt(pedido.quantidade) * precoItem + precoBebida;

          setConversas((prev) => {
            const semForm = prev.filter(
              (i) => i.tipo !== "editar-pedido"
            );
            return [
              ...semForm,
              {
                id: (Date.now() + 1).toString(),
                texto: `✅ Pedido atualizado com sucesso!\n\n🍽️ Item: ${
                  pedido.item
                } (x${pedido.quantidade})\n🥤 Bebida: ${
                  pedido.bebida || "Nenhuma"
                }\n💬 Observações: ${
                  pedido.obs || "Nenhuma"
                }\n\n💰 Total: R$ ${total.toFixed(2)}`,
                de: "bot",
              },
            ];
          });
        }}
      />
    </AnimatedBalao>
  );
}


            // Mensagens padrão
            return (
              <AnimatedBalao
                style={[
                  styles.balao,
                  item.de === "cliente" ? styles.cliente : styles.bot,
                ]}
              >
                <Text
                  style={
                    item.de === "cliente"
                      ? styles.textoCliente
                      : styles.textoBot
                  }
                >
                  {item.texto}
                </Text>
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
          <Pressable
            onPress={() => enviarMensagem()}
            android_ripple={{ color: "transparent" }}
            style={({ pressed }) => [
              styles.botaoEnviar,
              pressed && styles.botaoEnviarPress,
            ]}
          >
            <Text style={styles.seta}>➤</Text>
          </Pressable>
        </View>

        <View style={styles.botoesRodape}>
          {[
            { label: "Cardápio", onPress: responderCardapio },
            { label: "Horários", onPress: responderHorario },
            {
              label: "Fazer Pedido",
              onPress: () =>
                setConversas((prev) => [
                  ...prev,
                  { id: Date.now().toString(), tipo: "pedido", de: "bot" },
                ]),
            },
            {
              label: "Ver Pedido",
              onPress: () => {
                console.log(pedidosIds());
                if (ultimoPedido) {
                  setConversas((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      tipo: "opcoes-pedido",
                      de: "bot",
                    },
                  ]);
                } else {
                  setConversas((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      texto: "Você não tem pedidos ativos. Deseja fazer um?",
                      de: "bot",
                    },
                  ]);
                  esperandoConfirmacao.current = "pedido";
                }
              },
            },
          ].map((btn) => (
            <Pressable
              key={btn.label}
              onPress={btn.onPress}
              android_ripple={{ color: "transparent" }}
              onHoverIn={() => setHovered(btn.label)}
              onHoverOut={() => setHovered(null)}
              style={({ pressed }) => [
                styles.botaoRodape,
                hovered === btn.label && styles.botaoRodapeHover,
                pressed && styles.botaoRodapePress,
              ]}
            >
              <Text style={styles.botaoTextoRodape}>{btn.label}</Text>
            </Pressable>
          ))}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retangulo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  topo: {
    backgroundColor: "#16C1D7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#b03a2e",
  },
  topoCurvo: {
    backgroundColor: "#16C1D7",
    height: 95,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 16,
    justifyContent: "center",
    // alignItems: 'center',
    // marginBottom: 10,
    position: "relative",
  },
  logoutBotao: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },

  headerCentro: {
    alignItems: "center",
    justifyContent: "center",
  },

  centroTopo: {
    flex: 1,
    alignItems: "center",
    marginRight: 40,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  nomeRestaurante: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },

  chat: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  balao: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 14,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  cliente: {
    backgroundColor: "#3498db",
    alignSelf: "flex-end",
  },
  bot: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  textoCliente: {
    fontSize: 15,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  textoBot: {
    fontSize: 15,
    color: "#000",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  envio: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  botaoEnviar: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#16C1D7",
    borderRadius: 20,
    marginLeft: 8,
  },
  seta: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  botoesRodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  botaoRodape: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    margin: 8,
    borderRadius: 24,
    width: "30%",
    maxWidth: 220,
    backgroundColor: "#16C1D7",
  },
  botaoRodapePress: {
    backgroundColor: "#1097A6",
  },
  botaoRodapeHover: {
    backgroundColor: "#1097A6",
  },

  botaoTextoRodape: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },
  acessoRodape: {
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  cancelarBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  cancelarTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  alterarBtn: {
    backgroundColor: "#e67e22",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 8,
  },
  alterarTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  opcoesRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  logoutIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
});
