const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const SECRET_KEY = "secret key";

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    User.create(username, email, hashedPassword, (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists." });
        }
        return res.status(500).json({ message: "Database error." });
      }
      res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY);
    res.json({ message: "Login successful.", token });
  });
};
