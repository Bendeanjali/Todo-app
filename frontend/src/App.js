/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*//*
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    await axios.post(API_URL, {
      title,
      description,
      completed: false,
    });

    setTitle("");
    setDescription("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${API_URL}/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const updateTodo = async () => {
    await axios.put(`${API_URL}/${editingId}`, {
      title,
      description,
      completed: false,
    });

    setEditingId(null);
    setTitle("");
    setDescription("");
    fetchTodos();
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>Todo Application</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {editingId ? (
        <button onClick={updateTodo}>Update Todo</button>
      ) : (
        <button onClick={addTodo}>Add Todo</button>
      )}

      <hr />

      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h4 style={{ textDecoration: todo.completed ? "line-through" : "" }}>
            {todo.title}
          </h4>
          <p>{todo.description}</p>

          <button onClick={() => toggleComplete(todo)}>
            {todo.completed ? "Undo" : "Complete"}
          </button>

          <button onClick={() => startEdit(todo)}>Edit</button>

          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;*/
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, completed: false }),
      });
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch {
      setError("Failed to add todo.");
    }
  };

  const updateTodo = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");
    const original = todos.find((t) => t.id === editingId);
    try {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          completed: original?.completed ?? false,
        }),
      });
      setEditingId(null);
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch {
      setError("Failed to update todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete.");
    }
  };

  const toggleComplete = async (todo) => {
    const updated = { ...todo, completed: !todo.completed };
    try {
      await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch {
      setError("Failed to update.");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setError("");
  };

  const filtered = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="noise" />
      <div className="glow" />
      <div className="container">

        <header>
          <p className="eyebrow">Stay organised</p>
          <h1>My Tasks</h1>
          <p className="subtitle">
            {todos.length} task{todos.length !== 1 ? "s" : ""} total
          </p>
        </header>

        {/* Form */}
        <div className="form-card">
          {error && <div className="error-msg">{error}</div>}
          <label className="form-label">
            {editingId ? "Edit task" : "New task"}
          </label>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (editingId ? updateTodo() : addTodo())
            }
          />
          <textarea
            rows={2}
            placeholder="Add a description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="btn-row">
            <button
              className="btn btn-primary"
              onClick={editingId ? updateTodo : addTodo}
            >
              {editingId ? "Save Changes" : "Add Task"}
            </button>
            {editingId && (
              <button className="btn btn-ghost" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="section-header">
          <span className="section-title">Tasks</span>
          <span className="count-badge">{filtered.length}</span>
        </div>

        {/* Filters */}
        <div className="filter-row">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✦</div>
            <div className="empty-text">
              {filter === "completed"
                ? "No completed tasks yet"
                : filter === "active"
                ? "No active tasks"
                : "Add your first task above"}
            </div>
          </div>
        ) : (
          <div className="todo-list">
            {filtered.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <button
                  className={`check-btn ${todo.completed ? "done" : ""}`}
                  onClick={() => toggleComplete(todo)}
                >
                  {todo.completed && <span className="check-icon">✓</span>}
                </button>

                <div className="todo-body">
                  <div className="todo-title">{todo.title}</div>
                  {todo.description && (
                    <div className="todo-desc">{todo.description}</div>
                  )}
                  {todo.createdAt && (
                    <div className="todo-meta">{formatDate(todo.createdAt)}</div>
                  )}
                </div>

                <div className="todo-actions">
                  <button className="action-btn" onClick={() => startEdit(todo)} title="Edit">
                    ✎
                  </button>
                  <button className="action-btn del" onClick={() => deleteTodo(todo.id)} title="Delete">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default App;