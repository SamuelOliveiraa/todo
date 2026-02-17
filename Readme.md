# 🚀 Challenge: Task Manager API

This project consists of the development of a Node.js API for task management. The main objective is to apply fundamental concepts of **CRUD**, file manipulation, and data streams.

---

## 💻 Technologies Used

- **Node.js**: Execution environment for the server.
- **Fastify**: Web framework for building the API, known for its high performance.
- **Prisma**: ORM for interacting with the database.
- **SQLite**: Relational database used for storing tasks.
- **TypeScript**: Superset of JavaScript that adds static typing to the code.
- **Zod**: Library for data schema validation.
- **Vitest**: Testing framework to ensure code quality.
- **Supertest**: Library for testing the HTTP API.

---

## ✨ Features

The API offers the following features:

| Method     | Route                 | Description                                                   |
| :--------- | :-------------------- | :------------------------------------------------------------ |
| **POST**   | `/tasks`              | Creates a new task with `title` and `description`.            |
| **GET**    | `/tasks`              | Lists all tasks (supports searching by title or description). |
| **PUT**    | `/tasks/:id`          | Updates the `title` and/or `description` of an existing task. |
| **DELETE** | `/tasks/:id`          | Removes a task by ID.                                         |
| **PATCH**  | `/tasks/:id/complete` | Toggles the task's completion status.                         |
| **POST**   | `/tasks/upload_csv`   | Creates new tasks from a CSV file.                            |
| **GET**    | `/tasks/export_csv`   | Exports tasks to a CSV file.                                  |

---

## 🧪 Tests

The application tests were developed with **Vitest** and **Supertest**. They ensure the correct functioning of all API routes, covering the following scenarios:

- Task creation.
- Listing all tasks.
- Filtering tasks by title and description.
- Updating tasks.
- Deleting tasks.
- Marking tasks as complete.
- Exporting tasks to CSV.

To run the tests, use the command:

```bash
npm run test
```

---

## 🚀 How to Run the Project

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-user/your-repository.git
    cd your-repository
    ```

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

3.  **Configure the environment variables:**

    Create a `.env` file in the root of the project, using `.env.example` as a reference.

4.  **Run the database migrations:**

    ```bash
    npx prisma migrate dev
    ```

5.  **Start the server:**

    ```bash
    npm run dev
    ```

---

## 📄 Import and Export via CSV

### Import

The API allows for the bulk creation of tasks by uploading a CSV file through the `POST /tasks/upload_csv` route. The file must follow this format:

```csv
title,description
Task 01,Description of Task 01
Task 02,Description of Task 02
```

### Export

It is possible to export the registered tasks to a CSV file through the `GET /tasks/export_csv` route.
