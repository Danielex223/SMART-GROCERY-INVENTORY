const express = require("express");
const router = express.Router();

let users = []; // simple in-memory users list

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ error: "All fields required" });

  if (users.find(u => u.email === email))
    return res.status(400).json({ error: "Email already exists" });

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,  // plain text (simple mode)
    role: "Employee"
  };

  users.push(newUser);
  return res.json({ message: "Account created", user: newUser, token: newUser.id });
});

// LOGIN (accept any email + password if matches)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user)
    return res.status(400).json({ error: "Invalid email or password" });

  return res.json({ message: "Logged in", token: user.id, user });
});

module.exports = router;
