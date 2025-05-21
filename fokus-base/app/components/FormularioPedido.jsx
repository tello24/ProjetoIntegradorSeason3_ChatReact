import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
  const [querBebida, setQuerBebida] = useState(
    pedidoInicial.bebida ? true : false
  );
  const [bebida, setBebida] = useState(pedidoInicial.bebida || '');
  const opcoesBebida = ['Água', 'Coca Cola', 'Coca Cola Zero', 'Suco'];

  const opcoesItem = [
    'Filé de Frango Grelhado',
    'Linguiça Toscana Grelhada',
    'Linguiça Calabresa Acebolada',
    'Nuggets de Frango',
    'Salada com Filé de Frango',
    'Salada com Omelete',
    'Salada com Atum',
    'Salada Caesar',
    'Salada com Kibe Vegano ou Quiche',
  ];

  const alterarQuantidade = (delta) => {
    setQuantidade((prev) => {
      const nova = prev + delta;
      return nova < 1 ? 1 : nova > 10 ? 10 : nova;
    });
  };

  const confirmar = () => {
    // valida apenas campos obrigatórios iniciais
    if (!nome || !ra || !item || quantidade < 1) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    onConfirmar({
      nome,
      ra,
      item,
      quantidade: quantidade.toString(),
      obs,
      bebida: querBebida ? bebida : null,
    });
  };

  return (
    <View style={styles.balaoPedido}>
      <Text style={styles.titulo}>🛒 Fazer Pedido</Text>

      <TextInput
        placeholder="Seu Nome*"
        placeholderTextColor="#888"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="RA do Aluno*"
        placeholderTextColor="#888"
        style={styles.input}
        value={ra}
        onChangeText={setRA}
      />

      <TouchableOpacity
        onPress={() => setMostrarItens(!mostrarItens)}
        style={styles.input}
      >
        <Text style={{ color: '#000' }}>{item || 'Selecionar Item*'}</Text>
      </TouchableOpacity>

      {mostrarItens && (
        <View style={styles.opcoesLinha}>
          {opcoesItem.map((it) => (
            <TouchableOpacity
              key={it}
              onPress={() => {
                setItem(it);
                setMostrarItens(false);
              }}
              style={[styles.opcaoBotao, item === it && styles.opcaoSelecionada]}
            >
              <Text
                style={[
                  styles.opcaoTexto,
                  item === it && styles.opcaoTextoSelecionado,
                ]}
              >
                {it}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.seletorQuantidade}>
        <TouchableOpacity
          onPress={() => alterarQuantidade(-1)}
          style={styles.botaoQtd}
        >
          <Text style={styles.qtdTexto}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtdValor}>{quantidade}</Text>
        <TouchableOpacity
          onPress={() => alterarQuantidade(1)}
          style={styles.botaoQtd}
        >
          <Text style={styles.qtdTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Observações"
        placeholderTextColor="#888"
        style={styles.input}
        value={obs}
        onChangeText={setObs}
      />

      {/* Pergunta sobre bebida opcional no final */}
      <View style={styles.opcoesLinha}>
  <TouchableOpacity
    style={[
      styles.opcaoBotao,
      querBebida && styles.verdeSelecionado,
    ]}
    onPress={() => setQuerBebida(true)}
  >
    <Text
      style={[
        styles.opcaoTexto,
        querBebida && styles.textoSelecionadoClaro,
      ]}
    >
      Sim
    </Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[
      styles.opcaoBotao,
      !querBebida && styles.vermelhoSelecionado,
    ]}
    onPress={() => setQuerBebida(false)}
  >
    <Text
      style={[
        styles.opcaoTexto,
        !querBebida && styles.textoSelecionadoClaro,
      ]}
    >
      Não
    </Text>
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
      <Text
        style={[
          styles.opcaoTexto,
          bebida === b && styles.textoSelecionadoClaro,
        ]}
      >
        {b}
      </Text>
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
  backgroundColor: '#A9A9A9'
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
