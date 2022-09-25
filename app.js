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

Express.get("/todos/", (request, response) => {
  const todoQuery = `select * from todo`;
  const responseQuery = db.all(todoQuery);
  response.send(responseQuery);
  console.log(todo);
});

Express.get("/todos/", (request, response) => {
  const todoQuery = `select * from todo`;
  const responseQuery = db.all(todoQuery);
  response.send(responseQuery);
});
