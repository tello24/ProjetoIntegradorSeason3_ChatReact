import React, { useState, useEffect } from 'react';
import { CARDAPIO_URL, PEDIDO_URL } from '../utils/config';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function FormularioPedido({ onConfirmar, pedidoInicial = {} }) {
  const [nome, setNome] = useState(pedidoInicial.nome || '');
  const [ra, setRA] = useState('');
  const [item, setItem] = useState(null);
  const [quantidade, setQuantidade] = useState(parseInt(pedidoInicial.quantidade) || 1);
  const [obs, setObs] = useState(pedidoInicial.obs || '');
  const [mostrarItens, setMostrarItens] = useState(false);
  const [querBebida, setQuerBebida] = useState(pedidoInicial.bebida ? true : false);
  const [bebida, setBebida] = useState(pedidoInicial.bebida || '');
  const [cardapio, setCardapio] = useState([]);
  const [perfil, setPerfil] = useState(''); // 'aluno' ou 'professor'


  const opcoesBebida = ['Água', 'Coca Cola', 'Coca Cola Zero', 'Suco'];

useEffect(() => {
  const carregarCardapio = async () => {
  try {
    const res = await fetch(CARDAPIO_URL);
    const data = await res.json();

    let todosItens = [];

    if (Array.isArray(data)) {
      todosItens = data.flatMap(cat => cat.itens || []);
    } else if (Array.isArray(data.categorias)) {
      todosItens = data.categorias.flatMap(cat => cat.itens || []);
    }

    setCardapio(todosItens);

    // 🔁 Se estiver editando um pedido
    if (pedidoInicial.item && typeof pedidoInicial.item === 'string') {
      const encontrado = todosItens.find(i => i.nome === pedidoInicial.item);
      if (encontrado) setItem(encontrado);
    }

  } catch (err) {
    console.error('❌ Erro ao carregar cardápio:', err);
    setCardapio([]);
  }

  // ✅ Carregar RA e perfil
  const raSalvo = await AsyncStorage.getItem('ra');
  if (raSalvo) setRA(raSalvo);

  const perfilSalvo = await AsyncStorage.getItem('perfil');
  if (perfilSalvo) setPerfil(perfilSalvo);
};


  const carregarRA = async () => {
    const raSalvo = await AsyncStorage.getItem('ra');
    if (raSalvo) setRA(raSalvo);
  };

  carregarCardapio();
  carregarRA();
}, []);




  const alterarQuantidade = (delta) => {
    setQuantidade(prev => {
      const nova = prev + delta;
      return nova < 1 ? 1 : nova > 10 ? 10 : nova;
    });
  };

  const confirmar = async () => {
    
    const itemSelecionado = typeof item === 'string'
  ? cardapio.find(i => i.nome === item)
  : item;

  if (!nome || !ra || !item?.nome || quantidade < 1) {
    alert('Por favor, preencha todos os campos obrigatórios!');
    return;
  }

  const precoItem = parseFloat(item?.preco) || 0;
  const totalItem = precoItem * quantidade;
  const precoBebida = querBebida && bebida ? 5 : 0;
  const totalGeral = totalItem + precoBebida;

  console.log('🧾 DEBUG:', {
    item,
    precoItem,
    quantidade,
    totalItem,
    precoBebida,
    totalGeral,
  });

  const resumo = `✅ Pedido realizado com sucesso!

🍽️ ${item.nome} (x${quantidade}) – R$ ${totalItem.toFixed(2)}
🥤 Bebida: ${querBebida && bebida ? bebida + ' – R$ 5,00' : 'Nenhuma'}
💬 Observações: ${obs || 'Nenhuma'}

💰 Total Comida: R$ ${totalItem.toFixed(2)}
💰 Total Bebida: R$ ${precoBebida.toFixed(2)}
💵 TOTAL: R$ ${totalGeral.toFixed(2)}`;

  // 👉 Envia para o backend
  try {
  const response = await fetch(PEDIDO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome,
      ra,
      item: itemSelecionado.nome,
      quantidade: quantidade.toString(),
      obs,
      bebida: querBebida ? bebida : null,
    }),
  });

  const json = await response.json();
  console.log('✅ Resposta do backend:', json);

  if (!response.ok) throw new Error(json.erro || 'Erro ao salvar pedido');
} catch (err) {
  console.error('❌ Erro no fetch:', err);
}


  // 👇 Isso ainda exibe o balão no chat normalmente
  onConfirmar({
  nome,
  ra,
  item: item.nome,
  quantidade: quantidade.toString(),
  obs,
  bebida: querBebida ? bebida : null,
  resumo,
  criadoEm: new Date().toISOString(), // ⏱️ campo de criação
});

};


  return (
    <View style={styles.balaoPedido}>
      <Text style={styles.titulo}>🛒 Fazer Pedido</Text>

      <TextInput placeholder="Seu Nome*" style={styles.input} value={nome} onChangeText={setNome} placeholderTextColor="#888" />

      <TouchableOpacity onPress={() => setMostrarItens(!mostrarItens)} style={styles.input}>
        <Text style={{ color: '#000' }}>{item?.nome || 'Selecionar Item*'}</Text>
      </TouchableOpacity>

      {mostrarItens && (
        <View style={styles.opcoesLinha}>
          {cardapio.map((it) => (
            <TouchableOpacity
              key={it.nome}
              onPress={() => {
                setItem(it);
                setMostrarItens(false);
              }}
              style={[styles.opcaoBotao, item?.nome === it.nome && styles.opcaoSelecionada]}
            >
              <Text style={[styles.opcaoTexto, item === it.nome && styles.opcaoTextoSelecionado]}>
                {it.nome} – R$ {it.preco.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.seletorQuantidade}>
        <TouchableOpacity onPress={() => alterarQuantidade(-1)} style={styles.botaoQtd}>
          <Text style={styles.qtdTexto}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtdValor}>{quantidade}</Text>
        <TouchableOpacity onPress={() => alterarQuantidade(1)} style={styles.botaoQtd}>
          <Text style={styles.qtdTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Observações" style={styles.input} value={obs} onChangeText={setObs} placeholderTextColor="#888" />

      <Text style={styles.titulo}>Deseja uma bebida?</Text>
      <View style={styles.opcoesLinha}>
        <TouchableOpacity style={[styles.opcaoBotao, querBebida && styles.verdeSelecionado]} onPress={() => setQuerBebida(true)}>
          <Text style={[styles.opcaoTexto, querBebida && styles.textoSelecionadoClaro]}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.opcaoBotao, !querBebida && styles.vermelhoSelecionado]} onPress={() => setQuerBebida(false)}>
          <Text style={[styles.opcaoTexto, !querBebida && styles.textoSelecionadoClaro]}>Não</Text>
        </TouchableOpacity>
      </View>

      {querBebida && (
        <View style={styles.opcoesLinha}>
          {opcoesBebida.map((b) => (
            <TouchableOpacity
              key={b}
              style={[styles.opcaoBotao, bebida === b && styles.pretoSelecionado]}
              onPress={() => setBebida(b)}
            >
              <Text style={[styles.opcaoTexto, bebida === b && styles.textoSelecionadoClaro]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={confirmar} style={styles.botaoConfirmar}>
        <Text style={styles.confirmarTexto}>✅ Confirmar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  balaoPedido: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    maxWidth: 320,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  opcoesLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  opcaoBotao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  opcaoSelecionada: {
    backgroundColor: '#c0392b',
  },
  verdeSelecionado: {
    backgroundColor: '#27ae60',
  },
  vermelhoSelecionado: {
    backgroundColor: '#e74c3c',
  },
  textoSelecionadoClaro: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pretoSelecionado: {
    backgroundColor: '#A9A9A9',
  },
  opcaoTexto: {
    color: '#000',
    fontWeight: 'bold',
  },
  opcaoTextoSelecionado: {
    color: '#fff',
  },
  seletorQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  botaoQtd: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtdTexto: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  qtdValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoConfirmar: {
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmarTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
