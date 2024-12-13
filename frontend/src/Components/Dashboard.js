import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Components/Service/Context";
import "./Dashboard.css";

const Dashboard = () => {
  const { logout, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
  });
  const [filter, setFilter] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/task`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setNewTask({ title: "", description: "", status: "To Do" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/task/${editingTask.id}`,
        editingTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks();
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = filter
    ? tasks.filter((task) => task.status === filter)
    : tasks;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Dashboard</h2>
      <button className="logout-button" onClick={logout}>
        Logout
      </button>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="task-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="task-input"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="task-status"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" className="task-button">
          Add Task
        </button>
      </form>

      <div className="filter-buttons">
        <button onClick={() => setFilter("")} className="filter-button">
          All
        </button>
        <button onClick={() => setFilter("To Do")} className="filter-button">
          To Do
        </button>
        <button
          onClick={() => setFilter("In Progress")}
          className="filter-button"
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter("Completed")}
          className="filter-button"
        >
          Completed
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.map((task) => (
          <ul key={task.id} className="task-item">
            <li>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <div style={{ display: "flex", gap: "50px" }}>
                <button
                  onClick={() => handleEditTask(task)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        ))}
      </div>

      {editingTask && (
        <form onSubmit={handleUpdateTask} className="edit-task-form">
          <h3>Edit Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
            className="task-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={editingTask.description}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
            className="task-input"
          />
          <select
            value={editingTask.status}
            onChange={(e) =>
              setEditingTask({ ...editingTask, status: e.target.value })
            }
            className="task-status"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" className="task-button">
            Update Task
          </button>
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="cancel-button"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
