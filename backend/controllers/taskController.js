const Task = require("../models/taskModel");

exports.getTasks = (req, res) => {
  Task.findByUserId(req.user.id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });
    res.json(results);
  });
};

exports.createTask = (req, res) => {
  const { title, description, status } = req.body;
  Task.create(
    req.user.id,
    title,
    description,
    status || "pending",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error." });
      res
        .status(201)
        .json({
          message: "Task created successfully.",
          taskId: result.insertId,
        });
    }
  );
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  Task.update(id, req.user.id, title, description, status, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized." });
    }

    res.json({ message: "Task updated successfully." });
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;

  Task.delete(id, req.user.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized." });
    }

    res.json({ message: "Task deleted successfully." });
  });
};
