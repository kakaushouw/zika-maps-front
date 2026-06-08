# 🦟 ZikaMaps

<div align="center">

![ZikaMaps Logo](https://github.com/kakaushouw/zika-maps-front/blob/9450c375245d5588922a81564a1a47effe7f477d/logo%20zikamaps.png)

**Plataforma cidadã de monitoramento e mapeamento de focos do *Aedes aegypti* em Manaus — AM**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-4AADA8?style=flat-square)](https://github.com/kakaushouw/zika-maps-front)
[![Licença](https://img.shields.io/badge/licença-MIT-4AADA8?style=flat-square)](LICENSE)
[![TCC](https://img.shields.io/badge/TCC-ADS%20%7C%20Fametro-4AADA8?style=flat-square)](#)
[![Cidade](https://img.shields.io/badge/cidade-Manaus%2C%20AM-4AADA8?style=flat-square)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

[Reportar Bug](https://github.com/kakaushouw/zika-maps-front/issues) · [Solicitar Feature](https://github.com/kakaushouw/zika-maps-front/issues)

</div>

---

## 📋 Sobre o Projeto

O **ZikaMaps** é uma plataforma web colaborativa de monitoramento e mapeamento da proliferação de mosquitos causadores de arboviroses, desenvolvida como Trabalho de Conclusão de Curso (TCC) no curso de **Análise e Desenvolvimento de Sistemas (ADS)** no Centro Universitário Fametro — Manaus, AM.

O sistema público de notificação (SINAN) é passivo e depende exclusivamente de profissionais de saúde, gerando subnotificação massiva de focos do *Aedes aegypti* — mosquito transmissor da Dengue, Zika e Chikungunya. O ZikaMaps resolve isso transformando o próprio morador em agente ativo da vigilância sanitária do seu bairro: qualquer cidadão pode registrar pelo navegador, com geolocalização automática e foto como evidência.

---

## ✨ Principais Funcionalidades

* 📍 **Geolocalização automática** — captura a posição do cidadão via GPS ao registrar um foco, sem necessidade de inserir endereço manualmente
* 🗺️ **Mapa de calor em tempo real** — visualização interativa via Leaflet.js sobre OpenStreetMap, mostrando a densidade de focos por bairro
* 📸 **Registro com foto** — o cidadão tira ou envia uma foto do criadouro como evidência, aumentando a confiabilidade das denúncias
* 🏥 **Painel do Agente Sanitário** — interface exclusiva para agentes de vigilância confirmarem, descartarem e marcarem focos como resolvidos
* 📊 **Histórico de denúncias** — cada cidadão acompanha o status de todas as suas denúncias em tempo real

---

## 🎬 Demonstração

### 📸 Screenshots

<div align="center">

| Tela de Login | Mapa de Focos |
|:---:|:---:|
| ![Tela de Login](https://github.com/kakaushouw/zika-maps-front/blob/edbb05eb737d3f5f8d54e8b2f4c1a52773096195/tela%20de%20login.png) | ![Mapa de Focos](https://github.com/kakaushouw/zika-maps-front/blob/edbb05eb737d3f5f8d54e8b2f4c1a52773096195/mapa%20de%20focos.png) |

| Registrar Denúncia | Minhas Denúncias |
|:---:|:---:|
| ![Registrar Denúncia](https://github.com/kakaushouw/zika-maps-front/blob/edbb05eb737d3f5f8d54e8b2f4c1a52773096195/registrador%20de%20den%C3%BAncias.png) | ![Minhas Denúncias](https://github.com/kakaushouw/zika-maps-front/blob/edbb05eb737d3f5f8d54e8b2f4c1a52773096195/minhas%20den%C3%BAncias.png) |

</div>

### 🎞️ GIF Demonstrativo

<div align="center">
  <img src="docs/demo.gif" alt="Demonstração do fluxo de denúncia no ZikaMaps" width="80%"/>
</div>

### 🎥 Vídeo Demonstrativo

> **[VÍDEO DEMONSTRATIVO]** — *(https://youtu.be/tLx0F75abqw)*

---

## 🛠️ Tecnologias Utilizadas

**Design & Prototipação**

[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white)](https://figma.com)
[![Lovable](https://img.shields.io/badge/Lovable%20Dev-FF6B6B?style=flat-square)](https://lovable.dev)

**Front-end**

[![React](https://img.shields.io/badge/React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet.js-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com)

**Back-end & Banco de Dados**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Python](https://img.shields.io/badge/Python%203.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)

**Ferramentas & Infraestrutura**

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)](https://git-scm.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com)

---

## 🚀 Começando

Este repositório contém o **front-end** do ZikaMaps. Para rodar localmente você precisa do Node.js e da API FastAPI rodando (repositório `zika-maps-back`).

### 📦 Pré-requisitos

* [Node.js](https://nodejs.org/) `>= 18.x`
* [npm](https://npmjs.com/) ou [bun](https://bun.sh/)
* [Git](https://git-scm.com/)
* API FastAPI do ZikaMaps em execução (ex.: `http://127.0.0.1:5000`)

### 💻 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/kakaushouw/zika-maps-front.git
```

2. **Acesse a pasta do projeto**
```bash
cd zika-maps-front
```

3. **Instale as dependências**

Com npm:
```bash
npm install
```

Ou com bun:
```bash
bun install
```

4. **Configure as variáveis de ambiente**

Copie o exemplo e ajuste se a API estiver em outra porta:
```bash
cp .env.example .env
```

Conteúdo do `.env` (desenvolvimento local):
```env
VITE_API_URL=http://127.0.0.1:5000
VITE_WS_URL=ws://127.0.0.1:5000/ws
```

Na **Vercel** (produção), defina as mesmas chaves com `https://api.zikamaps.com.br` e `wss://api.zikamaps.com.br/ws`.

5. **Execute o projeto**

Com npm:
```bash
npm run dev
```

Ou com bun:
```bash
bun dev
```

6. **Acesse no navegador**
```
http://localhost:8080
```

---

## 📖 Como Usar

### Perfil Cidadão

1. Cadastre-se ou faça login com seu e-mail na tela inicial
2. Na tela **Mapa**, visualize os focos registrados na sua região
3. Clique em **Denunciar** — o sistema captura sua localização via GPS automaticamente, tire ou envie uma foto do criadouro, adicione uma descrição opcional e confirme o envio
4. Acompanhe o status das suas denúncias em **Minhas Denúncias**

### Perfil Agente de Vigilância Sanitária

1. Faça login com e-mail institucional de agente
2. Acesse o **Painel de Gestão** para visualizar todas as denúncias recebidas
3. Analise a imagem e a localização de cada foco
4. Altere o status para **Confirmado** (foco válido) ou **Descartado** (inválido)
5. Após a intervenção em campo, marque o foco como **Resolvido**

---

## 🗂️ Estrutura de Pastas

```
📦 zika-maps-front/
├── 📁 public/              # Assets estáticos públicos
├── 📁 src/                 # Código-fonte principal
│   ├── 📁 components/      # Componentes React reutilizáveis
│   ├── 📁 hooks/           # Custom hooks
│   ├── 📁 lib/             # API, store e utilitários
│   ├── 📁 pages/           # Telas da aplicação
│   └── 📄 main.tsx         # Ponto de entrada da aplicação
├── 📄 .env.example         # Modelo de variáveis (commitar)
├── 📄 .env                 # Suas variáveis locais (não commitar — ver .gitignore)
├── 📄 index.html           # HTML principal
├── 📄 package.json         # Dependências e scripts do projeto
├── 📄 vite.config.ts       # Configuração do Vite
├── 📄 tailwind.config.ts   # Configuração do Tailwind CSS
├── 📄 tsconfig.json        # Configuração do TypeScript
└── 📄 README.md
```

---

## 🧪 Testes

O projeto utiliza **Vitest** para testes unitários e **Playwright** para testes end-to-end.

Rodar os testes unitários:
```bash
npm run test
```

Rodar os testes em modo watch:
```bash
npm run test:watch
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Faça um **Fork** do projeto
2. Crie uma **Branch** para sua feature
```bash
git checkout -b feature/MinhaFeature
```
3. **Commit** suas mudanças
```bash
git commit -m 'feat: adiciona MinhaFeature'
```
4. **Push** para a branch
```bash
git push origin feature/MinhaFeature
```
5. Abra um **Pull Request**

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

| Nome | Papel | GitHub | LinkedIn | Email |
|------|-------|--------|----------|-------|
| Kaell Soares Calacina | Desenvolvedor & Documentador | [@kakaushouw](https://github.com/kakaushouw) | — | kaelcina@gmail.com |
| Ana Lívia da Costa Silva | Documentadora e analista | [@liviacosttaa](https://github.com/liviacosttaa) | [LinkedIn](https://www.linkedin.com/in/liviacossttaa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app) | analiviasas@gmail.com |
| Vitória Santos de Azevedo | Testadora & Documentadora | [@csvick](https://github.com/csvick) | — | vitoriaazevedo.r91@gmail.com |
| Luiz Henrique Moutinho Laranjeira | Documentador e analista | [@luizhmoutinho](https://github.com/luizhmoutinho) | [LinkedIn](https://www.linkedin.com/in/luizhmoutinho?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app) | luizhmoutinho@gmail.com |
| João Etto de Souza Gomes | Designer & Documentador | [@JoaoEtto](https://github.com/JoaoEtto) | [LinkedIn](https://www.linkedin.com/in/joão-etto-7b6775323) | joaoettogomes@gmail.com |

**Orientadora:** Luana Magalhães Leal — prof.luanalealm@gmail.com

---

## 🙏 Agradecimentos

* À professora orientadora **Luana Magalhães Leal** pelo suporte durante o desenvolvimento do TCC
* À **Fametro** pela estrutura acadêmica e oportunidade de desenvolver o projeto
* Ao [OpenStreetMap](https://openstreetmap.org) pela base cartográfica gratuita e aberta
* Ao [Leaflet.js](https://leafletjs.com) pela biblioteca de mapas interativos

---

<div align="center">

⭐ Se este projeto foi útil, considere dar uma estrela!

Manaus, AM · TCC — ADS Fametro 2026

feito com amor by equipe

</div>