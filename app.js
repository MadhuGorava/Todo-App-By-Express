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

Express.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const todoQuery = `select * from todo where status = ${status}`;
  const responseQuery = await db.all(todoQuery);
  response.send(responseQuery);
  console.log(todo);
});

Express.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const todoQuery = `select * from todo where priority = ${priority}`;
  const responseQuery = await db.all(todoQuery);
  response.send(responseQuery);
});

Express.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const todoQuery = `select * from todo where priority = ${priority} and status = ${status}`;
  const responseQuery = await db.all(todoQuery);
  response.send(responseQuery);
});

Express.get("/todos/", async (request, response) => {
  const { searchQ } = request.query;
  const todoQuery = `select * from todo where search_q like "%${searchQ}%"`;
  const responseQuery = await db.all(todoQuery);
  response.send(responseQuery);
});

Express.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoQuery = `select * from todo where id = ${todoId}`;
  const responseQuery = await db.all(todoQuery);
  response.send(responseQuery);
});

Express.post("/todos/", async (request, response) => {
  const { todoId, todo } = request.body;
  const { priority, status } = request.query;
  const todoQuery = `insert into todo (id, todo, priority, status) values (${todoId}, '${todo}', '${priority}', '${status}')`;
  await db.all(todoQuery);
  response.send("Todo Successfully Added");
});

Express.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.query;
  const todoQuery = `update todo set status = '${status}' where todo_id = ${todoId}`;
  await db.all(todoQuery);
  response.send("Status Updated");
});

Express.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.query;
  const todoQuery = `update todo set priority = '${priority}' where todo_id = ${todoId}`;
  await db.all(todoQuery);
  response.send("Priority Updated");
});

Express.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const todoQuery = `update todo set todo = '${todo}' where todo_id = ${todoId}`;
  await db.all(todoQuery);
  response.send("Todo Updated");
});

Express.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const todoQuery = `delete todo where todo_id = ${todoId}`;
  await db.all(todoQuery);
  response.send("Todo Deleted");
});

module.exports = Express;
