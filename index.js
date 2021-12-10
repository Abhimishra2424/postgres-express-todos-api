const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json()); // => to parse the body of the request

// routes
// get all todos
app.get("/todos", async (req, res) => {
  try {
    const alltodos = await pool.query("SELECT * FROM todo.todo");
    res.json(alltodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo.todo WHERE todo = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// create todos
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo.todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error);
  }
});


// update todos
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    console.log(id, description);
    const updateTodo = await pool.query(
      "UPDATE todo.todo SET description = $1 WHERE todo = $2 RETURNING *",
      [description, id]
    );
    res.json(updateTodo.rows[0]);
  } catch (error) {
    console.error(error);
  }
});


// delete todos
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo.todo WHERE todo = $1", [
      id,
    ]);
    res.json(deleteTodo.rows[0]);
  } catch (error) {
    console.error(error);
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
