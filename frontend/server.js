import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import {
  sequelize,
  User,
  Category,
  Transaction,
  syncDatabase,
} from "./database.js";

const app = express();

app.use(cors());
app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

function authenticateToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
}

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
  res.status(200).json({ token });
});

app.post("/add-category", authenticateToken, async (req, res) => {
  const { name, priority, isFun } = req.body;
  const newCategory = await Category.create({
    name,
    priority,
    isFun,
    userId: req.user.id,
  });
  res
    .status(200)
    .json({ message: "Category added successfully", category: newCategory });
});

app.post("/record-transaction", authenticateToken, async (req, res) => {
  const { type, amount, categoryName } = req.body;
  const newTransaction = await Transaction.create({
    type,
    amount,
    categoryName,
    userId: req.user.id,
  });
  res.status(201).json({
    message: "Transaction recorded successfully",
    transaction: newTransaction,
  });
});

app.get("/categories", authenticateToken, async (req, res) => {
  const categories = await Category.findAll({ where: { userId: req.user.id } });
  res.json(categories);
});

app.get("/transactions", authenticateToken, async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { userId: req.user.id },
  });
  res.json(transactions);
});

app.get("/budget", authenticateToken, async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { userId: req.user.id },
  });
  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpenses += transaction.amount;
    }
  });

  const remainingBudget = totalIncome - totalExpenses;
  res.json({ totalIncome, totalExpenses, remainingBudget });
});

syncDatabase().then(() => {
  app.listen(8080, () => console.log("Server running on port 8080"));
});
