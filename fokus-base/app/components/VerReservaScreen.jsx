// import React from 'react';
// import { View, Text, StyleSheet, ScrollView } from 'react-native';

// const Mensagem = ({ texto, alinhamento }) => (
//   <View style={[styles.balao, alinhamento === 'direita' ? styles.direita : styles.esquerda]}>
//     <Text style={styles.texto}>{texto}</Text>
//   </View>
// );

// export default function VerReservaScreen({ route }) {
//   const reserva = route?.params?.reserva;

//   if (!reserva) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.semReserva}>Nenhuma reserva encontrada.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Mensagem texto="📋 Detalhes da sua reserva:" alinhamento="esquerda" />
//       <Mensagem texto={`👤 Nome: ${reserva.nome}`} alinhamento="direita" />
//       <Mensagem texto={`📅 Data: ${reserva.data}`} alinhamento="direita" />
//       <Mensagem texto={`⏰ Horário: ${reserva.horario}`} alinhamento="direita" />
//       <Mensagem texto={`👥 Pessoas: ${reserva.pessoas}`} alinhamento="direita" />
//       <Mensagem texto={`📞 Telefone: ${reserva.telefone}`} alinhamento="direita" />
//       <Mensagem texto={`📝 Observações: ${reserva.obs || 'Nenhuma'}`} alinhamento="direita" />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f0f0f0',
//   },
//   balao: {
//     maxWidth: '80%',
//     padding: 12,
//     borderRadius: 16,
//     marginVertical: 6,
//   },
//   esquerda: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#ffffff',
//   },
//   direita: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#dcf8c6',
//   },
//   texto: {
//     fontSize: 16,
//     color: '#000',
//   },
//   semReserva: {
//     fontSize: 16,
//     color: '#999',
//     textAlign: 'center',
//     marginTop: 100,
//   },
// });
