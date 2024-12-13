const express = require("express");
const taskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/task", authenticateToken, taskController.getTasks);
router.post("/task", authenticateToken, taskController.createTask);
router.put("/task/:id", authenticateToken, taskController.updateTask);
router.delete("/task/:id", authenticateToken, taskController.deleteTask);

module.exports = router;
