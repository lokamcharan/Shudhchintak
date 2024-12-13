const db = require("../config/db");

const Task = {
  findByUserId: (userId, callback) => {
    db.query("SELECT * FROM tasks WHERE user_id = ?", [userId], callback);
  },

  create: (userId, title, description, status, callback) => {
    db.query(
      "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)",
      [userId, title, description, status],
      callback
    );
  },

  update: (id, userId, title, description, status, callback) => {
    db.query(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
      [title, description, status, id, userId],
      callback
    );
  },

  delete: (id, userId, callback) => {
    db.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId],
      callback
    );
  },
};

module.exports = Task;
