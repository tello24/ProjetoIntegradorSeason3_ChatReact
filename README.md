
# 🤖 ChatBot para Restaurante - Projeto Integrador Season 3

![React Native](https://img.shields.io/badge/React%20Native-2025-blue)
![Expo](https://img.shields.io/badge/Expo-managed-lightgrey)
![Node.js](https://img.shields.io/badge/Node.js-backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-database-brightgreen)

## 📌 Visão Geral

Este é um ChatBot interativo para restaurantes, desenvolvido com **React Native**, **Expo** e backend em **Node.js com MongoDB**.  
O projeto faz parte do **Projeto Integrador - Season 3**, com o objetivo de facilitar pedidos, reservas e comunicação entre cliente e cantina.

🔗 **Protótipo no Figma:** [Acessar Design](https://www.figma.com/design/fCtj8CQUTwQJYgujfegtDk/Untitled?node-id=1-2&t=tuYnPnGNzIJ9S1wH-1)

---

## 👥 Grupo

| Nome Completo                 | RA         |
| :---------------------------- | :--------- |
| Eike Barbosa                  | 24.00652-0 |
| Giovanni Guariglia de Camargo | 23.00136-4 |
| Pedro Vasconcelos             | 24.00923-7 |
| Renan Schiavotello            | 24.00202-0 |
| Matheus Garcia                | 24.00304-2 |
| Wolf Meijome                  | 24.95008-4 |

---

---

## 🚀 Começando

### ✅ Pré-requisitos

- Node.js **v18+**
- npm **v9+**
- Expo CLI (`npm install -g expo-cli`)

---

### 📦 Instalação

```bash
git clone https://github.com/tello24/ProjetoIntegradorSeason3_ChatReact
cd ProjetoIntegradorSeason3_ChatReact/fokus-base
npm install
npm install mongoose cors bcrypt
```

---

## ▶️ Executando o projeto

```bash
# TERMINAL 1 - Backend
cd fokus-base
node server.js

# TERMINAL 2 - iniciar o app multiplataforma
cd fokus-base 
npx expo start --tunnel

```

Abra o app no **Expo Go** (Android/iOS) escaneando o QR Code exibido no terminal ou navegador.

---

## 🛠️ Solução de Problemas

> ⚠️ **Se o servidor não iniciar**, execute:
```bash
npm install mongoose cors bcrypt
```

---

## 🔐 Login - Acesso Cozinha (ADM)

```
Usuário: cozinha@gmail.com
Senha: teste123
```

---

## 📁 Estrutura do Projeto

```
fokus-base/
├── .expo/                
├── .vscode/               
├── app/
│   ├── assets/
│   │   └── logo.jpg
│   ├── components/
│   │   ├── FormularioPedido.jsx
│   │   ├── FormularioReserva.jsx
│   │   ├── BalaoPedidoComTempo.jsx
│   │   └── VerReservaScreen.jsx
│   ├── acesso-cozinha.jsx
│   ├── cadastro.jsx
│   ├── chat-aluno.jsx
│   ├── editar-cardapio.jsx
│   ├── index.jsx
│   ├── painel-cozinha.jsx
│   ├── reservar.jsx
│   └── _layout.jsx
├── utils/
│   └── config.js
├── criarRestaurante.js
├── server.js
├── app.json
├── tsconfig.json
├── package.json
├── package-lock.json
├── eslint.config.js
└── .gitignore

# Após rodar `npm install`
├── node_modules/
```