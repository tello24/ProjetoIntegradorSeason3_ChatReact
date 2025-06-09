import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BalaoPedidoComTempo({ pedido, onCancelar, onEditar }) {
  const [tempoRestante, setTempoRestante] = useState(null);
  const [botaoAtivo, setBotaoAtivo] = useState(true);

  useEffect(() => {
    if (!pedido.criadoEm) return;

    const criadoEm = new Date(pedido.criadoEm);
    const agora = new Date();
    const diffSegundos = Math.max(0, 60 - Math.floor((agora - criadoEm) / 1000));

    setTempoRestante(diffSegundos);
    setBotaoAtivo(diffSegundos > 0);

    const intervalo = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setBotaoAtivo(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [pedido.criadoEm]);

  return (
    <View style={styles.balao}>
      <Text style={styles.titulo}>📦 <Text style={{ fontWeight: 'bold' }}>Pedido Atual</Text></Text>
      <Text>Cliente: {pedido.nome}</Text>
      <Text>RA: {pedido.ra}</Text>
      <Text>Item: {pedido.item}</Text>
      <Text>Qtd: {pedido.quantidade}</Text>
      <Text>Obs.: {pedido.obs || 'Nenhuma'}</Text>
      <Text>Bebida: {pedido.bebida || 'Nenhuma'}</Text>

      {botaoAtivo && (
        <>
          <Text style={styles.textoInfo}>⏱️ Você tem 60 segundos para editar ou cancelar este pedido.</Text>
          <View style={styles.opcoes}>
            <TouchableOpacity onPress={onCancelar} style={styles.btnCancelar}>
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onEditar} style={styles.btnEditar}>
              <Text style={styles.textoBotao}>Alterar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {botaoAtivo && tempoRestante !== null && (
        <Text style={styles.contador}>⏳ {tempoRestante}s restantes</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  balao: {
     padding: 12,
    marginVertical: 5,
    borderRadius: 14,
    maxWidth: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  textoInfo: {
    marginTop: 10,
    marginBottom: 6,
    color: '#555',
  },
  opcoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  btnCancelar: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnEditar: {
    backgroundColor: '#f39c12',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contador: {
    marginTop: 8,
    color: '#999',
  },
});
