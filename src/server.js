import express from "express";
import { json } from "body-parser";
import { createConnection } from "mysql2";
import cors from "cors";

const app = express();
const port = 3001;

// Kết nối đến cơ sở dữ liệu MySQL
const db = createConnection({
  host: "localhost",
  user: "root",
  password: "ltvlhk1504###***",
  database: "todolist_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.use(cors());
app.use(json());

// Tạo API để tạo mới công việc
app.post("/todo", (req, res) => {
  const { name, status } = req.body;
  const insertQuery = "INSERT INTO todos (name, status) VALUES (?, ?)";
  const selectQuery = "SELECT * FROM todos WHERE id = LAST_INSERT_ID()";

  db.query(insertQuery, [name, status], (err, result) => {
    if (err) {
      console.error("Error adding todo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      db.query(selectQuery, (err, todo) => {
        if (err) {
          console.error("Error fetching inserted todo:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json(todo[0]);
        }
      });
    }
  });
});

// Tạo API để lấy danh sách công việc
app.get("/todo", (req, res) => {
  const query = "SELECT * FROM todos";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching todos:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(result);
    }
  });
});

// Tạo API để update công việc thành completed
app.put("/todo/:id", (req, res) => {
  const { id } = req.params;
  const updateQuery = 'UPDATE todos SET status = "complete" WHERE id = ?';
  const selectQuery = "SELECT * FROM todos WHERE id = ?";

  db.query(updateQuery, [id], (err, result) => {
    if (err) {
      console.error("Error updating todo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      db.query(selectQuery, [id], (err, todo) => {
        if (err) {
          console.error("Error fetching updated todo:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(200).json(todo[0]);
        }
      });
    }
  });
});

// Tạo API để xóa một công việc
app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todos WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting todo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
