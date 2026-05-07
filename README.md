# Chatbot com IA — Atividade Acadêmica

Aplicação web de chatbot interativo construída com React, Vite e integração com a API Groq (modelo LLaMA 3.3 70B). Permite configurar o comportamento do agente via **System Prompt** persistido no banco de dados em tempo real com Convex.

**Elaborado por:**
Pedro Henrique Paula · Weuller Silva · Nycolas Fernandes Oliveira · Lucas Fonseca Silva Dantas

---

## Funcionalidades

- Seleção de **personas pré-definidas**: E-commerce, Suporte Técnico, Atendimento Bancário e modo Livre
- Editor de **System Prompt** personalizado com persistência via Convex
- Interface de chat com indicador de digitação animado
- Navegação entre o Dashboard (chat) e a página de configuração de System Prompt
- Suporte a autenticação via `@convex-dev/auth`

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 8 |
| Linguagem de modelo | LLaMA 3.3 70B via [Groq API](https://groq.com) |
| Banco de dados em tempo real | [Convex](https://convex.dev) |
| Estilo | CSS-in-JS inline |

---

## Como rodar localmente

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local com:
# VITE_GROQ_API_KEY=sua_chave_groq

# Inicie o backend Convex (em terminal separado)
npx convex dev

# Inicie o frontend
npm run dev
```

---

## Estrutura principal

```
src/
  components/
    chatPage.jsx        # Interface do chat + chamada à API Groq
    sistemPrompt.js     # Presets de persona e prompt padrão
    systemPromptForm.jsx # Formulário de edição do system prompt
    menuBar.tsx         # Barra de navegação
    AuthPage.jsx        # Página de autenticação
  Pages.jsx             # Roteamento por hash (#dashboard / #system-prompt)
  App.jsx               # Ponto de entrada
convex/
  model/systemPrompt/   # Mutations e queries do system prompt persistido
```

---

## Documentação Técnica: RAG na IA

### 1. O que é RAG (Retrieval-Augmented Generation)?

O **Retrieval-Augmented Generation (RAG)**, ou Geração Aumentada de Recuperação, é uma técnica arquitetural no campo da Inteligência Artificial que otimiza a saída de um Modelo de Linguagem de Grande Escala (LLM). Em vez de confiar apenas nos dados estáticos presentes em seu treinamento original, o RAG permite que o modelo consulte uma base de dados externa e confiável antes de gerar uma resposta.

> **Analogia:** Imagine que um LLM é um estudante brilhante que fez uma prova baseando-se apenas na memória (treinamento). O RAG é como permitir que esse mesmo estudante consulte livros específicos de uma biblioteca atualizada durante a prova para garantir que suas respostas sejam precisas e fundamentadas em fatos recentes.

Essa técnica resolve dois grandes problemas dos LLMs tradicionais:
- **Alucinações** — quando o modelo inventa informações com confiança
- **Limite de conhecimento** — o modelo não sabe nada sobre eventos após sua data de corte de treinamento ou sobre dados privados de uma empresa

---

### 2. Como o RAG Funciona?

O processo de RAG segue quatro etapas fundamentais:

1. **Criação do Índice (Embedding):** Documentos brutos (PDFs, textos, manuais) são transformados em vetores numéricos (embeddings) e armazenados em um Banco de Dados Vetorial.
2. **Recuperação (Retrieval):** Quando o usuário faz uma pergunta, o sistema busca no banco de dados os fragmentos de texto semanticamente mais parecidos com a dúvida.
3. **Aumentação (Augmentation):** A pergunta do usuário é combinada com os fragmentos encontrados, criando um "prompt enriquecido".
4. **Geração (Generation):** O LLM recebe esse contexto extra e gera uma resposta baseada prioritariamente nas informações fornecidas.

---

### 3. Utilidades e Benefícios

#### 3.1 Precisão e Redução de Alucinações
Ao forçar o modelo a "ler" um documento antes de responder, a probabilidade de ele inventar fatos diminui drasticamente, pois ele está ancorado em fontes reais.

#### 3.2 Atualização em Tempo Real
Diferente do Fine-Tuning (ajuste fino), que exige um novo treinamento caro e demorado, no RAG basta adicionar um novo documento ao banco de dados para que a IA "aprenda" instantaneamente sobre aquele novo assunto.

#### 3.3 Transparência e Citações
Sistemas RAG podem indicar exatamente de qual parágrafo ou documento retiraram a informação, permitindo que o usuário verifique a veracidade da fonte (auditabilidade).

#### 3.4 Segurança de Dados Privados
Empresas podem usar modelos de IA públicos sem treinar o modelo com seus dados confidenciais. Os dados ficam em um servidor privado e são enviados apenas como contexto temporário durante a consulta.

---

### 4. Exemplos de Uso

**Suporte Técnico Inteligente**
Uma empresa de software conecta sua IA a todos os manuais técnicos e logs de erro. Quando um cliente pergunta como resolver um problema específico, a IA busca a solução exata nos manuais e responde passo a passo, sem confundir as versões do produto.

**Análise Jurídica e Compliance**
Advogados utilizam RAG para consultar milhares de processos e jurisprudências. O sistema localiza decisões anteriores semelhantes e resume os argumentos principais, economizando horas de pesquisa manual.

**Onboarding de Funcionários (RH)**
Novos colaboradores podem perguntar para um bot interno: *"Qual a política de férias para quem trabalha remoto?"*. A IA consulta o PDF do Manual do Colaborador e responde de forma personalizada.

---

### 5. Conclusão

O RAG representa a ponte entre a inteligência criativa dos modelos de linguagem e a confiabilidade dos dados corporativos. É hoje a **técnica padrão ouro** para criar assistentes de IA que precisam lidar com informações dinâmicas, proprietárias ou que exigem alta precisão factual.

---

*Documentação Técnica de IA — 2024*
