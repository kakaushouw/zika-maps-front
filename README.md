# 🦟 ZikaMaps

<div align="center">

<img src="docs/assets/logo.png" alt="ZikaMaps Logo" width="140"/>

**Plataforma cidadã de monitoramento e mapeamento de focos do *Aedes aegypti* em Manaus — AM**

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-4AADA8?style=flat-square)](https://github.com/kakaushouw/zika-spot-guard)
[![Licença](https://img.shields.io/badge/licença-MIT-4AADA8?style=flat-square)](LICENSE)
[![TCC](https://img.shields.io/badge/TCC-ADS%20%7C%20Fametro-4AADA8?style=flat-square)](#)
[![Cidade](https://img.shields.io/badge/cidade-Manaus%2C%20AM-4AADA8?style=flat-square)](#)
[![Python](https://img.shields.io/badge/python-3.11-blue?style=flat-square&logo=python)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/docker-containerizado-2496ED?style=flat-square&logo=docker)](https://docker.com)

[Demo ao Vivo](#) · [Reportar Bug](https://github.com/kakaushouw/zika-spot-guard/issues) · [Solicitar Feature](https://github.com/kakaushouw/zika-spot-guard/issues)

</div>

---

## 📋 Sobre o Projeto

O **ZikaMaps** é uma plataforma web colaborativa de vigilância epidemiológica participativa, desenvolvida como Trabalho de Conclusão de Curso (TCC) no curso de **Análise e Desenvolvimento de Sistemas (ADS)** no Centro Universitário Fametro — Manaus, AM.

O sistema público de notificação (SINAN) é passivo e depende exclusivamente de profissionais de saúde, gerando subnotificação massiva de focos do *Aedes aegypti* — mosquito transmissor da Dengue, Zika e Chikungunya. O ZikaMaps resolve isso transformando o próprio morador em agente ativo da vigilância sanitária do seu bairro: qualquer cidadão pode registrar criadouros pelo navegador, com geolocalização automática e foto como evidência.

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
| <img src="docs/screenshots/login.png" alt="Login" width="400"/> | <img src="docs/screenshots/mapa.png" alt="Mapa" width="400"/> |

| Registrar Denúncia | Minhas Denúncias |
|:---:|:---:|
| <img src="docs/screenshots/denuncia.png" alt="Denúncia" width="400"/> | <img src="docs/screenshots/historico.png" alt="Histórico" width="400"/> |

| Painel do Agente | Mapa de Calor |
|:---:|:---:|
| <img src="docs/screenshots/painel.png" alt="Painel" width="400"/> | <img src="docs/screenshots/heatmap.png" alt="Heatmap" width="400"/> |

</div>

### 🎞️ GIF Demonstrativo

<div align="center">
  <img src="docs/demo.gif" alt="Demonstração do fluxo de denúncia no ZikaMaps" width="80%"/>
</div>

### 🎥 Vídeo Demonstrativo

> **[VÍDEO DEMONSTRATIVO]** — *(link será adicionado aqui)*

---

## 🛠️ Tecnologias Utilizadas

**Design & Prototipação**

[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white)](https://figma.com)
[![Lovable](https://img.shields.io/badge/Lovable%20Dev-FF6B6B?style=flat-square)](https://lovable.dev)

**Front-end**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet.js-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com)

**Back-end**

[![Python](https://img.shields.io/badge/Python%203.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)

**Banco de Dados**

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![PostGIS](https://img.shields.io/badge/PostGIS-4AADA8?style=flat-square)](https://postgis.net)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

**Ferramentas**

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)](https://git-scm.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com)

---

## 🚀 Começando

### 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Python](https://python.org/) `>= 3.11`
* [PostgreSQL](https://postgresql.org/) `>= 14` com extensão [PostGIS](https://postgis.net/)
* [Docker](https://docker.com/) *(opcional, recomendado)*
* [Git](https://git-scm.com/)

### 💻 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/kakaushouw/zika-spot-guard.git
```

2. **Acesse a pasta do projeto**
```bash
cd zika-spot-guard
```

3. **Crie e ative o ambiente virtual**
```bash
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

4. **Instale as dependências**
```bash
pip install -r requirements.txt
```

5. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/zikamaps
FLASK_ENV=development
SECRET_KEY=sua_chave_secreta_aqui
PORT=5000
OSM_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

6. **Configure o banco de dados**
```bash
psql -U postgres -c "CREATE DATABASE zikamaps;"
psql -U postgres -d zikamaps -c "CREATE EXTENSION postgis;"
python manage.py db upgrade
```

7. **Execute o projeto**
```bash
python app.py
```

8. **Acesse no navegador**
```
http://localhost:5000
```

---

## 📖 Como Usar

### Perfil Cidadão

1. Cadastre-se ou faça login com seu e-mail
2. Na tela **Mapa**, visualize os focos registrados na sua região
3. Clique em **Denunciar** — o sistema captura sua localização via GPS, tire ou envie uma foto do criadouro, adicione uma descrição opcional e confirme o envio
4. Acompanhe o status das suas denúncias em **Minhas Denúncias**

### Perfil Agente de Vigilância Sanitária

1. Faça login com e-mail institucional de agente
2. Acesse o **Painel de Gestão** para visualizar todas as denúncias
3. Analise a imagem e a localização de cada foco
4. Altere o status para **Confirmado** ou **Descartado**
5. Após a intervenção em campo, marque o foco como **Resolvido**

---

## 🗂️ Estrutura de Pastas

```
📦 zika-spot-guard
├── 📁 app/
│   ├── 📁 routes/         # Rotas da API REST (Flask Blueprints)
│   ├── 📁 models/         # Modelos do banco de dados (ORM)
│   ├── 📁 services/       # Regras de negócio e lógica de geolocalização
│   └── 📁 utils/          # Funções auxiliares
├── 📁 frontend/
│   ├── 📁 css/            # Estilos da interface
│   ├── 📁 js/             # Scripts e integração com Leaflet.js
│   └── 📁 pages/          # Páginas HTML
├── 📁 docs/
│   ├── 📁 assets/         # Logo e recursos visuais
│   └── 📁 screenshots/    # Capturas de tela para o README
├── 📁 migrations/         # Migrações do banco de dados
├── 📁 tests/              # Testes automatizados
├── 📄 app.py              # Ponto de entrada da aplicação
├── 📄 requirements.txt
├── 📄 docker-compose.yml
├── 📄 README.md
└── 📄 .env.example
```

---

## 🧪 Testes

Execute os testes com:
```bash
pytest
```

Para cobertura de testes:
```bash
pytest --cov=app tests/
```

---

## 👥 Equipe

| Nome | Papel | GitHub |
|------|-------|--------|
| Kaell Soares Calacina | Desenvolvedor & Documentador | [@kakaushouw](https://github.com/kakaushouw) |
| Ana Lívia da Costa Silva | Documentadora | — |
| Vitória Santos de Azevedo | Testadora & Documentadora | — |
| Luiz Henrique Moutinho Laranjeira | Documentador | — |
| João Etto de Souza Gomes | Designer & Documentador | [@JoaoEtto](https://github.com/JoaoEtto) |

**Orientadora:** Luana Magalhães Leal

---

## 🙏 Agradecimentos

* À professora orientadora **Luana Magalhães Leal** pelo suporte durante o desenvolvimento do TCC
* À **Fametro** pela estrutura acadêmica e oportunidade de desenvolver o projeto
* Ao [OpenStreetMap](https://openstreetmap.org) pela base cartográfica gratuita e aberta
* Ao [Leaflet.js](https://leafletjs.com) pela biblioteca de mapas interativos

---

<div align="center">

⭐ Se este projeto foi útil, considere dar uma estrela!

Feito com 🦟 e ❤️ em Manaus, AM · TCC — ADS Fametro 2026

Made with ❤️ by [Kaell Soares](https://github.com/kakaushouw) e equipe

</div>