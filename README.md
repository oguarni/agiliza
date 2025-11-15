# Agiliza

Um aplicativo full-stack de gerenciamento de tarefas focado em produtividade, implementando Clean Architecture e Controle de Acesso Baseado em Papel.

**Repositório:** https://github.com/oguarni/status-point.git

## 📖 Descrição

O Agiliza é uma aplicação web responsiva projetada para auxiliar usuários a organizar, acompanhar e concluir tarefas pessoais ou profissionais de forma simples e eficiente.

A aplicação é composta por um frontend intuitivo (React) e um backend robusto (Node.js + Express + Sequelize), que se comunicam via API REST segura com autenticação JWT.

## ✨ Funcionalidades Principais

- ✅ **Autenticação de Usuário:** Cadastro e login seguros com JWT e criptografia bcrypt.
- ✅ **Controle de Acesso (RBAC):** Três níveis de permissão: admin, gestor e colaborador.
- ✅ **Gerenciamento de Tarefas (CRUD):** Criação, leitura, atualização e exclusão de tarefas com autorização baseada no proprietário.
- ✅ **Gerenciamento de Projetos:** Gestores e admins podem criar projetos para agrupar tarefas.
- ✅ **Quadro Kanban:** Visualização de tarefas no formato drag-and-drop (A Fazer, Concluídas).
- ✅ **Recursos Avançados de Tarefa:**
  - **Comentários:** Adicione discussões a tarefas.
  - **Anexos:** Faça upload e download de arquivos (imagens, documentos, etc.).
  - **Histórico:** Rastreamento automático de mudanças de status.
- ✅ **Internacionalização (i18n):** Suporte completo para Português-BR (padrão) e Inglês.

## 🛠️ Stack de Tecnologias

| Camada | Tecnologia |
|--------|------------|
| **Backend** | Node.js, Express, TypeScript, PostgreSQL, Sequelize, JWT |
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Axios |
| **Testes** | Jest, Supertest (100% de cobertura na camada de serviço) |
| **DevOps** | Docker, Docker Compose (com hot-reload) |

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, garantindo a separação de responsabilidades, testabilidade e independência de frameworks. A lógica de negócio é isolada em **Domain Entities** e **Use Cases**, sem depender de detalhes de infraestrutura como o banco de dados ou a API web.

### Diagramas C4

- **Nível 1:** Contexto do Sistema
- **Nível 2:** Visão de Contêineres
- **Nível 3:** Componentes do Backend

## 🚀 Como Executar (Docker)

O método recomendado para execução é usando Docker Compose, que configura o frontend, o backend e o banco de dados automaticamente.

**Pré-requisitos:**
- Git
- Docker e Docker Compose

```bash
# 1. Clone o repositório
git clone https://github.com/oguarni/status-point.git
cd status-point

# 2. Inicie os contêineres
# (O backend se conectará ao banco no host via host.docker.internal)
# (Certifique-se que seu .env no backend está correto)
docker compose up
```

**Acesse a aplicação:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

### Contas de Teste

Você pode usar as contas abaixo para testar os diferentes níveis de permissão:

| Papel | E-mail | Senha |
|-------|--------|-------|
| **Admin** | admin@taskmanager.com | admin123 |
| **Gestor** | gestor@taskmanager.com | gestor123 |
| **Colaborador** | colaborador@taskmanager.com | colaborador123 |

## 📁 Estrutura do Projeto

```
.
├── backend/              # API em Node.js + Express (Clean Architecture)
│   ├── src/
│   │   ├── domain/       # Entidades de negócio (Ex: Task, User, Project)
│   │   ├── usecases/     # Lógica de aplicação (Ex: CreateTaskUseCase)
│   │   ├── services/     # Lógica de negócio e autorização
│   │   ├── repositories/ # Camada de acesso a dados (Abstração)
│   │   ├── controllers/  # Endpoints da API (HTTP)
│   │   ├── mappers/      # Conversores ORM <-> Domain
│   │   ├── models/       # Modelos do Sequelize (ORM)
│   │   └── migrations/   # Migrações do banco
│   └── Dockerfile
│
├── frontend/             # Aplicação SPA em React
│   ├── src/
│   │   ├── pages/        # Componentes de página (Ex: TasksPage)
│   │   ├── components/   # Componentes reutilizáveis (Ex: Layout)
│   │   ├── contexts/     # Contexto (Ex: AuthContext)
│   │   ├── services/     # Clientes de API (Axios)
│   │   └── i18n/         # Arquivos de internacionalização
│   └── Dockerfile
│
├── docs/                 # Diagramas de arquitetura (C4)
├── docker-compose.yml    # Orquestração do Docker
└── CLAUDE.md             # Guia técnico detalhado para desenvolvedores
```

## 🧪 Testes (Backend)

O backend possui **100% de cobertura de testes** na camada de serviços.

```bash
# Navegue até o diretório do backend
cd backend

# 1. Instale as dependências (se ainda não o fez)
npm install

# 2. Execute todos os testes
npm test

# 3. Execute testes em modo 'watch'
npm run test:watch

# 4. Gere um relatório de cobertura
npm run test:coverage
```

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como trabalho da disciplina de **Arquitetura de Software (AS27S)**, da turma **7ES1**, ofertada pelo Curso de Engenharia de Software da **Universidade Tecnológica Federal do Paraná (UTFPR)**, campus Dois Vizinhos.

**Orientação:** Profª. Dr. Francisco Carlos.

O objetivo principal foi aplicar na prática os conceitos de **Clean Architecture**, **SOLID**, **Domain-Driven Design (DDD)** e **Controle de Acesso Baseado em Papel (RBAC)**.

### Autores

- Aurélio Antonio Brites de Miranda
- Gabriel Felipe Guarnieri

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
