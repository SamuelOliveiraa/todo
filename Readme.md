# 🚀 Desafio: Task Manager API

Este projeto consiste no desenvolvimento de uma API em Node.js para o gerenciamento de tarefas (tasks). O objetivo principal é aplicar conceitos fundamentais de **CRUD**, manipulação de arquivos e fluxos de dados (streams).

---

## 📋 Sobre o Desafio

A API foi projetada para gerenciar um fluxo de tarefas, permitindo a persistência de dados e a manipulação em massa através de scripts de importação.

### Estrutura de uma Tarefa

Cada tarefa possui a seguinte estrutura de dados:

- **id**: Identificador único.
- **title**: Título da tarefa.
- **description**: Descrição detalhada.
- **completed_at**: Data de conclusão (inicia como `null`).
- **created_at**: Data de criação.
- **updated_at**: Data da última atualização.

---

## 🛣 Rotas e Regras de Negócio

| Método     | Rota                  | Descrição                                                       |
| :--------- | :-------------------- | :-------------------------------------------------------------- |
| **POST**   | `/tasks`              | Cria uma nova tarefa com `title` e `description`.               |
| **GET**    | `/tasks`              | Lista todas as tarefas (suporta busca por título ou descrição). |
| **PUT**    | `/tasks/:id`          | Atualiza o `title` e/ou `description` de uma tarefa existente.  |
| **DELETE** | `/tasks/:id`          | Remove uma tarefa pelo ID.                                      |
| **PATCH**  | `/tasks/:id/complete` | Alterna o status de conclusão da tarefa.                        |

### Regras Adicionais

- **Validação de ID**: Para as rotas `PUT`, `DELETE` e `PATCH`, a API valida se o registro existe no banco de dados. Caso contrário, retorna uma mensagem informando que o registro não existe.
- **Datas Automáticas**: Os campos `created_at` e `updated_at` são gerenciados automaticamente pela aplicação.

---

## 📄 Importação via CSV

A importação de dados pode ser feita através de um script dedicado (`import-csv.js`).

1.  **Ferramenta**: Utiliza a biblioteca `csv-parse`.
2.  **Funcionamento**: O script lê o arquivo CSV, utiliza um iterador assíncrono (`for await`) e, para cada linha, realiza uma requisição `POST` para a rota `/tasks`.
3.  **Formato do CSV**:
    ```csv
    title,description
    Task 01,Descrição da Task 01
    Task 02,Descrição da Task 02
    ```

---

## 💡 Sugestões de Melhoria (Indo Além)

- [ ] Validar se as propriedades `title` e `description` estão presentes no corpo das requisições `POST` e `PUT`.
- [ ] Implementar mensagens de erro customizadas para registros não encontrados.

---

## ✅ Checklist de Entrega

### Rotas da API

- [ X ] Criar tarefa (`POST /tasks`)
- [ X ] Listar tarefas (`GET /tasks`)
- [ X ] Busca por filtro no título e descrição
- [ X ] Atualizar tarefa (`PUT /tasks/:id`)
- [ X ] Validar ID no update
- [ X ] Remover tarefa (`DELETE /tasks/:id`)
- [ X ] Validar ID na remoção
- [ X ] Marcar como completa/pendente (`PATCH /tasks/:id/complete`)
- [ X ] Validar ID no patch

### Importação de Arquivos

- [ ] Criar script `import-csv.js`
- [ ] Implementar leitura com `csv-parse` e iterador async
- [ ] Enviar requisições POST para cada linha lida
