# 🤖 ChatBot para Restaurante - Projeto Integrador Season 3

![React Native](https://img.shields.io/badge/React%20Native-2025-blue)
![Expo](https://img.shields.io/badge/Expo-managed-lightgrey)
![NSIS](https://img.shields.io/badge/NSIS-installer-success)

## 📌 Visão Geral

Este é um ChatBot interativo para restaurantes, desenvolvido com **React Native**, **Expo** e **NSIS**.  
O projeto faz parte do **Projeto Integrador - Season 3**, com o objetivo de facilitar pedidos, reservas e comunicação entre cliente e cozinha.

🔗 **Protótipo no Figma:** [Acessar Design](https://www.figma.com/design/fCtj8CQUTwQJYgujfegtDk/Untitled?node-id=1-2&t=tuYnPnGNzIJ9S1wH-1)

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
cd ProjetoIntegradorSeason3_ChatBotReact/fokus-base
npm install
npm install mongoose cors bcrypt
```

---

## ▶️ Executando o projeto

```bash
TERMINAL 1:
cd fokus_base
node server.js

TERMINAL 2:
cd fokus_base
node criarRestaurante.js

TERMINAL 3:
cd fokus_base
npx expo start
pressionar "w" após carregar
```

Abra o app no Expo Go (Android/iOS) escaneando o QR Code exibido no terminal ou navegador.

---

## 🛠️ Solução de Problemas

- - SE O SERVER NÃO INICIAR - - 
npm install mongoose cors bcrypt

---

## 🔐 Login - Acesso Cozinha (ADM)

```
Usuário: 
Senha: 
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
│   │   └── VerReservaScreen.jsx
│   ├── acesso-cozinha.jsx
│   ├── cadastro.jsx
│   ├── chat-aluno.jsx
│   ├── editar-cardapio.jsx
│   ├── index.jsx
│   ├── painel-cozinha.jsx
│   ├── reservar.jsx
│   └── _layout.jsx
├── .gitignore
├── app.json
├── criarRestaurante.js
├── eslint.config.js
├── expo-env.d.ts
├── package-lock.json
├── package.json
├── server.js
└── tsconfig.json

# Após rodar `npm install`
├── node_modules/          # dependências do projeto

```

---
## 💬 Observações

Nada a declarar.
