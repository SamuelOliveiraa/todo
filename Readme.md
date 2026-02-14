# 🚀 Desafio: Task Manager API

Este projeto consiste no desenvolvimento de uma API em Node.js para o gerenciamento de tarefas (tasks). O objetivo principal é aplicar conceitos fundamentais de **CRUD**, manipulação de arquivos e fluxos de dados (streams).

---

## 💻 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para o servidor.
- **Fastify**: Framework web para a construção da API, conhecido por sua alta performance.
- **Prisma**: ORM para a interação com o banco de dados.
- **SQLite**: Banco de dados relacional utilizado para o armazenamento das tarefas.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código.
- **Zod**: Biblioteca para validação de schemas de dados.
- **Vitest**: Framework de testes para garantir a qualidade do código.
- **Supertest**: Biblioteca para testar a API HTTP.

---

## ✨ Funcionalidades

A API oferece as seguintes funcionalidades:

| Método     | Rota                  | Descrição                                                       |
| :--------- | :-------------------- | :-------------------------------------------------------------- |
| **POST**   | `/tasks`              | Cria uma nova tarefa com `title` e `description`.               |
| **GET**    | `/tasks`              | Lista todas as tarefas (suporta busca por título ou descrição). |
| **PUT**    | `/tasks/:id`          | Atualiza o `title` e/ou `description` de uma tarefa existente.  |
| **DELETE** | `/tasks/:id`          | Remove uma tarefa pelo ID.                                      |
| **PATCH**  | `/tasks/:id/complete` | Alterna o status de conclusão da tarefa.                        |
| **POST**   | `/tasks/upload_csv`   | Cria novas tarefas a partir de um arquivo CSV.                  |
| **GET**    | `/tasks/export_csv`   | Exporta as tarefas para um arquivo CSV.                         |

---

## 🧪 Testes

Os testes da aplicação foram desenvolvidos com o **Vitest** e o **Supertest**. Eles garantem o correto funcionamento de todas as rotas da API, cobrindo os seguintes cenários:

- Criação de tarefas.
- Listagem de todas as tarefas.
- Filtragem de tarefas por título e descrição.
- Atualização de tarefas.
- Remoção de tarefas.
- Marcação de tarefas como concluídas.
- Exportação de tarefas para CSV.

Para executar os testes, utilize o comando:

```bash
npm run test
```

---

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

4.  **Execute as migrações do banco de dados:**

    ```bash
    npx prisma migrate dev
    ```

5.  **Inicie o servidor:**

    ```bash
    npm run dev
    ```

---

## 📄 Importação e Exportação via CSV

### Importação

A API permite a criação de tarefas em massa através do upload de um arquivo CSV pela rota `POST /tasks/upload_csv`. O arquivo deve seguir o seguinte formato:

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
```

### Exportação

É possível exportar as tarefas cadastradas para um arquivo CSV através da rota `GET /tasks/export_csv`.
