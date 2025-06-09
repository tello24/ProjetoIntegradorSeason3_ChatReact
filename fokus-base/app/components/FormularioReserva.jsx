// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// export default function FormularioReserva({ onConfirmar, reservaInicial = {} }) {
//   const anoAtual = new Date().getFullYear();

//   const [ra, setRA] = useState(reservaInicial.ra || '');
//   const [mostrarPessoas, setMostrarPessoas] = useState(false);
//   const [mostrarHorarios, setMostrarHorarios] = useState(false);
//   const [nome, setNome] = useState(reservaInicial.nome || '');
//   const [data, setData] = useState(reservaInicial.data ? new Date(reservaInicial.data) : new Date());
//   const [horario, setHorario] = useState(reservaInicial.horario || '');
//   const [pessoas, setPessoas] = useState(reservaInicial.pessoas || '');
//   const [telefone, setTelefone] = useState(reservaInicial.telefone || '');
//   const [obs, setObs] = useState(reservaInicial.obs || '');

//   const horarios = [
//     '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
//     '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
//   ];

//   const opcoesPessoas = ['1', '2', '3', '4', '5', '6', '7+'];

//   function formatarData(d) {
//     const dia = String(d.getDate()).padStart(2, '0');
//     const mes = String(d.getMonth() + 1).padStart(2, '0');
//     const ano = d.getFullYear();
//     return `${dia}/${mes}/${ano}`;
//   }

//   const confirmar = () => {
//     if (!nome || !data || !horario || !pessoas || !telefone) {
//       alert('Por favor, preencha todos os campos obrigatórios!');
//       return;
//     }

//     const anoSelecionado = data.getFullYear();
//     if (anoSelecionado !== anoAtual) {
//       alert(`Só é possível reservar para o ano de ${anoAtual}`);
//       return;
//     }

//     onConfirmar({
//       nome,
//       ra,
//       data: formatarData(data),
//       horario,
//       pessoas,
//       telefone,
//       obs,
//     });
//   };

//   const formatarTelefone = (valor) => {
//     const numeros = valor.replace(/\D/g, '');
//     if (numeros.length <= 2) {
//       return `(${numeros}`;
//     } else if (numeros.length <= 6) {
//       return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
//     } else if (numeros.length <= 10) {
//       return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
//     } else {
//       return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
//     }
//   };

//   const handleTelefone = (texto) => {
//     setTelefone(formatarTelefone(texto));
//   };

//   return (
//     <View style={styles.balaoReserva}>
//       <Text style={styles.titulo}>📅 Fazer Reserva</Text>

//       <TextInput
//         placeholder="Seu Nome*"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={nome}
//         onChangeText={setNome}
//       />

//       <TextInput
//         placeholder="RA do Aluno*"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={ra}
//         onChangeText={setRA}
//       />


// <View style={styles.input}>
//   <Text style={{ color: '#000' }}>{formatarData(data)}</Text>
// </View>


//       <TouchableOpacity onPress={() => setMostrarHorarios(!mostrarHorarios)} style={styles.input}>
//         <Text style={{ color: '#000' }}>{horario || 'Selecionar horário*'}</Text>
//       </TouchableOpacity>

//       {mostrarHorarios && (
//         <View style={styles.opcoesLinha}>
//           {horarios.map((h) => (
//             <TouchableOpacity
//               key={h}
//               onPress={() => {
//                 setHorario(h);
//                 setMostrarHorarios(false);
//               }}
//               style={[
//                 styles.opcaoBotao,
//                 horario === h && styles.opcaoSelecionada
//               ]}
//             >
//               <Text style={styles.opcaoTexto}>{h}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       <TouchableOpacity onPress={() => setMostrarPessoas(!mostrarPessoas)} style={styles.input}>
//         <Text style={{ color: '#000' }}>{pessoas || 'Selecionar nº de pessoas*'}</Text>
//       </TouchableOpacity>

//       {mostrarPessoas && (
//         <View style={styles.opcoesLinha}>
//           {opcoesPessoas.map((p) => (
//             <TouchableOpacity
//               key={p}
//               onPress={() => {
//                 setPessoas(p);
//                 setMostrarPessoas(false);
//               }}
//               style={[
//                 styles.opcaoBotao,
//                 pessoas === p && styles.opcaoSelecionada
//               ]}
//             >
//               <Text style={styles.opcaoTexto}>{p}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       <TextInput
//         placeholder="Telefone*"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={telefone}
//         onChangeText={handleTelefone}
//         keyboardType="numeric"
//         maxLength={15}
//       />

//       <TextInput
//         placeholder="Observações"
//         placeholderTextColor="#888"
//         style={styles.input}
//         value={obs}
//         onChangeText={setObs}
//       />

//       <TouchableOpacity onPress={confirmar} style={styles.botaoConfirmar}>
//         <Text style={styles.confirmarTexto}>✅ Confirmar Reserva</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   balaoReserva: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 12,
//     marginVertical: 6,
//     maxWidth: 320,
//     alignSelf: 'flex-start',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   titulo: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//     color: '#000',
//   },
//   opcoesLinha: {
//     flexDirection: 'column',
//     gap: 8,
//     marginBottom: 12,
//   },
//   opcaoBotao: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     backgroundColor: '#eee',
//     borderRadius: 6,
//   },
//   opcaoSelecionada: {
//     backgroundColor: '#c0392b',
//   },
//   opcaoTexto: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   botaoConfirmar: {
//     backgroundColor: '#2ecc71',
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   confirmarTexto: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });
