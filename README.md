# ICD Hub - Integrador Universal v2.0

O **ICD Hub** é uma extensão robusta para Google Chrome desenvolvida para otimizar o fluxo de trabalho da **Ingresso com Desconto**. A ferramenta atua como uma ponte inteligente entre grandes plataformas de turismo (Grayline, Headout, GetYourGuide) e o sistema interno de gestão, automatizando tarefas repetitivas e centralizando a comunicação via WhatsApp e Webmail.

---

## 📸 Demonstração
<img src="./screenshot/banner.jpg" alt="Banner do Projeto">
*Central de Automação e Produtividade para Operadores.*

---

## ✨ Funcionalidades Principais

### 🟢 1. WhatsApp Sidebar Hub
Barra lateral injetada diretamente no WhatsApp Web com atalhos de produtividade.
* **Atalhos Rápidos:** Envio de textos padronizados (PIX, Valores, Boas-vindas) com um clique.
* **Sistema de Imagens (Drag & Drop):** Miniaturas de vouchers e informativos que podem ser arrastadas diretamente para a conversa.
* **Posicionamento Dinâmico:** O usuário escolhe no painel se deseja a barra na **Direita**, **Esquerda** ou no **Topo**.
* **Filtro de Busca:** Localize atalhos instantaneamente.

### 📧 2. Automação de E-mail (Locaweb)
Integração inteligente com o Webmail da Locaweb para envios individuais ou em massa.
* **Preenchimento Automático:** Assunto, destinatário e corpo do e-mail são preenchidos via extensão.
* **Preservação de Assinatura:** O sistema identifica e mantém a assinatura oficial do operador no final do e-mail.
* **Modo CCO (Relatório):** Selecione múltiplos clientes no relatório de visitas e prepare um único e-mail com todos em Cópia Oculta.

### 🎫 3. Voucher & Relatório de Visitas
* **Botão Inteligente de Voucher:** Aparece exclusivamente na página de `voucher.asp`, capturando nome e e-mail do cliente automaticamente.
* **Injeção de Checkboxes:** Transforma o relatório de previsão de visitas em uma lista de disparos em massa.
* **Nome do operador para todas plataformas**
* **Renomeia automaticamente o voucher com os dados do visitante para salvamento em PDF**

### 🌉 4. Bridge (Ponte) de Dados
Extração e preenchimento automático (Auto-fill) de dados provenientes de:
* **TourCMS (Grayline)**
* **Headout Hub**
* **GetYourGuide Supplier**

---

## 🛠️ Tecnologias Utilizadas
* **Linguagens:** JavaScript (ES6+), HTML5, CSS3.
* **API do Chrome:** `chrome.storage`, `chrome.runtime`, `content_scripts`.
* **Manipulação de Imagem:** HTML5 Canvas (para conversão Base64/Drag & Drop).

---

## ⚙️ Instalação e Configuração

1. Faça o download ou clone este repositório.
2. Acesse `chrome://extensions/` no seu Google Chrome.
3. Ative o **Modo do Desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
5. Clique no ícone da extensão e vá em **Opções** para configurar seus atalhos e mensagens de e-mail.

---

## 📁 Estrutura de Arquivos
```text
ICD-Hub/
├── manifest.json         # Configurações mestre da extensão
├── popup.html            # Interface rápida ao clicar no ícone
├── options.html          # Painel de Controle (Configurações)
├── scripts/
│   ├── whatsapp_tool.js  # Lógica do WhatsApp Sidebar
│   ├── relatorio_tool.js # Lógica de CCO no relatório
│   ├── mail_tool.js      # Integração com Locaweb
│   └── enviar_voucher.js # Botão específico de Voucher
└── styles/
    ├── whatsapp.css      # Design da barra lateral
    └── options.css       # Design do painel de controle

---

Desenvolvido por Bruno Ferreira para uso interno da equipe ICD.
