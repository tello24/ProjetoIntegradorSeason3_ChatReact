// app/components/FormularioReserva.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function FormularioReserva({ onConfirmar }) {
  const [nome, setNome] = useState('');
  const [pessoas, setPessoas] = useState('');
  const [obs, setObs] = useState('');

  const botoes = ['1', '2', '3', '4', '5', '6', '7+'];

  const confirmar = () => {
    if (nome && pessoas) {
      onConfirmar({ nome, pessoas, obs });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📅 Fazer Reserva</Text>

      <TextInput
        style={styles.input}
        placeholder="Seu Nome*"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Nº de Pessoas*</Text>
      <View style={styles.row}>
        {botoes.map((qtd) => (
          <TouchableOpacity
            key={qtd}
            style={[styles.botao, pessoas === qtd && styles.selecionado]}
            onPress={() => setPessoas(qtd)}
          >
            <Text style={styles.botaoTexto}>{qtd}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={obs}
        onChangeText={setObs}
      />

      <TouchableOpacity style={styles.confirmar} onPress={confirmar}>
        <Text style={styles.confirmarTexto}>✅ Confirmar Reserva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10, gap: 8 },
  label: { fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  botao: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selecionado: {
    backgroundColor: '#c0392b',
  },
  botaoTexto: {
    color: '#000',
    fontWeight: 'bold',
  },
  confirmar: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmarTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
