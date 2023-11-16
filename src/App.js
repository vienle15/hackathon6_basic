import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    // Gọi API để lấy danh sách công việc từ server khi component được render
    axios
      .get("http://localhost:3001/todo")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAddTodo = () => {
    // Gọi API để thêm công việc mới
    axios
      .post("http://localhost:3001/todo", {
        name: newTodo,
        status: "uncompleted",
      })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo("");
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  const handleCompleteTodo = (id) => {
    // Gọi API để update công việc thành completed
    axios
      .put(`http://localhost:3001/todo/${id}`)
      .then((response) => {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, status: "complete" };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error completing todo:", error);
      });
  };

  const handleDeleteTodo = (id) => {
    // Gọi API để xóa công việc
    axios
      .delete(`http://localhost:3001/todo/${id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  return (
    <div>
      <h1>User Manager</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <div>
        <h2>Uncompleted</h2>
        <ul>
          {todos
            .filter((todo) => todo.status === "uncompleted")
            .map((todo) => (
              <li key={todo.id}>
                {todo.name}
                <button onClick={() => handleCompleteTodo(todo.id)}>
                  Complete
                </button>
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h2>Completed</h2>
        <ul>
          {todos
            .filter((todo) => todo.status === "complete")
            .map((todo) => (
              <li key={todo.id}>
                {todo.name}
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
