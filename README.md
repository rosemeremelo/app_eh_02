# 🚀 Hub de Qualificação e Registro de Atendimentos

Uma plataforma web minimalista, moderna e responsiva voltada para a triagem de ideias/projetos e gerenciamento completo do histórico de mentorias. O sistema unifica o fluxo desde o cadastro inicial do empreendedor até o acompanhamento contínuo de sessões de mentoria com registros de fotos.

---

## 📸 Demonstração Visual

### 1. Formulário de Qualificação Inicial
Interface limpa com divisores dourados e campos padronizados para coleta rápida de dados cruciais do negócio e do responsável.
*(Insira aqui um print da sua tela ou use a imagem de referência)*

### 2. Banco de Empreendimentos Qualificados
Painel estilo dashboard onde as empresas salvas são listadas dinamicamente com ações rápidas para abertura de histórico e exportação.

### 3. Histórico e Registro de Atendimentos
Painel corporativo azul com blocos flutuantes em tom pastel para controle rigoroso de datas, modalidades, minutas de reuniões e upload de evidências fotográficas.

---

## ✨ Funcionalidades Principais

- **Qualificação Unificada:** Captação de dados estruturados da Empresa (CNPJ, Demanda Inicial) e do Empreendedor (CPF, Contatos) em uma única etapa inteligente.
- **Persistência em Tempo de Execução:** Ao clicar em `Salvar no Banco de Dados`, as informações são validadas e injetadas de forma dinâmica em uma lista de monitoramento.
- **Design de Cards Interativos:** Visualização profissional inspirada em dashboards modernos (Bootstrap/Clean CSS), utilizando paleta de cores assertiva (Azul Corporativo, Detalhes em Amarelo/Laranja e Alertas em Vermelho).
- **Gerenciador Dinâmico de Atendimentos:** Criação e remoção fluida de sessões de mentoria individuais com comportamento de rolagem suave (`smooth scroll`).
- **Upload de Evidências:** Input customizado estilo *drag and drop* para anexar fotos de reuniões diretamente no corpo do atendimento correspondente.
- **Responsividade Total:** Grid flexível (`CSS Grid` e `Flexbox`) que se adapta perfeitamente a computadores, tablets e smartphones.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias puras (Vanilla), sem a necessidade de frameworks pesados, garantindo performance máxima e carregamento instantâneo:

- **HTML5:** Estruturação semântica dos blocos de dados.
- **CSS3:** Estilização premium baseada em variáveis de design moderno, sombras suaves (`box-shadow`), cantos arredondados, transições e animações de surgimento (`@keyframes`).
- **JavaScript (ES6+):** Manipulação dinâmica do DOM para inserção, validação de formulários e remoção dos blocos de registros em tempo real.

---

## 📂 Estrutura do Projeto

```text
├── index.html          # Estrutura principal e containers dos blocos
├── style.css           # Arquivo unificado de estilização global e dinâmica
└── script.js           # Lógica do CRUD em tela e interações do usuário
