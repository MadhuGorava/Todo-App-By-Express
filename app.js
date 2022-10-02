const express = require("express");
const Express = express();
Express.use(express.json());

const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    Express.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//return a list of all the players from the team
//API 1

const convertPlayerToResponseObject = (objectItem) => {
  return {};
};

const hasPriorityAndStatus = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};
const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const hasSearchProperty = (requestQuery) => {
  return requestQuery.search_q !== undefined;
};

Express.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", priority, status, category } = request.query;

  switch (true) {
    //scenario 3
    /**----------- has priority and status -------- */
    case hasPriorityAndStatusProperties(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        if (
          status === "TO DO" ||
          status === "IN PROGRESS" ||
          status === "DONE"
        ) {
          getTodosQuery = `SELECT * FROM todo  WHERE status = '${status}' AND priority = '${priority}';`;
          data = await db.all(getTodosQuery);
          response.send(data);
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;
    case hasPriorityProperty(request.query):
      if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
        getTodosQuery = `
      SELECT * FROM todo WHERE priority = '${priority}';`;
        data = await db.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    //scenario 1
    /**-------------has only status ------------ */
    case hasStatusProperty(request.query):
      if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
        getTodosQuery = `SELECT * FROM todo WHERE status = '${status}';`;
        data = await db.all(getTodosQuery);
        response.send(data);
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;
    //has only search property
    //scenario 4
    case hasSearchProperty(request.query):
      getTodosQuery = `select * from todo where todo like '%${search_q}%';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      break;
    default:
      getTodosQuery = `select * from todo;`;
      data = await db.all(getTodosQuery);
      response.send(data);
      break;
  }
});

Express.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getQuery = `SELECT * FROM todo WHERE id = ${todoId}`;
  const todoResponse = await db.get(getQuery);
  response.send(todoResponse);
});
Express.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const todoQuery = `insert into todo (id, todo, priority, status) values (${id}, '${todo}', '${priority}', '${status}')`;
  await db.run(todoQuery);
  response.send("Todo Successfully Added");
});

Express.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.query;
  const todoQuery = `update todo set status = '${status}' where id = ${todoId}`;
  await db.run(todoQuery);
  response.send("Status Updated");
});

Express.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.query;
  const todoPriorityQuery = `update todo set priority = '${priority}' where id = ${todoId}`;
  await db.run(todoPriorityQuery);
  response.send("Priority Updated");
});

Express.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const todoTodoQuery = `update todo set todo = '${todo}' where id = ${todoId}`;
  await db.run(todoTodoQuery);
  response.send("Todo Updated");
});

Express.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const todoQuery = `delete from todo where id = ${todoId}`;
  await db.get(todoQuery);
  response.send("Todo Deleted");
});

module.exports = Express;
