import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { User, Category, Transaction, Goal, syncDatabase } from "./database.js";

const app = express();

app.use(cors());
app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

/**
 * Middleware function to authenticate a token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
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

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
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

/**
 * Logs in a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
  res.status(200).json({ token });
});

/**
 * Retrieves categories for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/categories", authenticateToken, async (req, res) => {
  const categories = await Category.findAll({ where: { userId: req.user.id } });
  res.json(categories);
});

/**
 * Adds a new category for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post("/add-category", authenticateToken, async (req, res) => {
  const { name, priority, isFun, limitAmount, limitCount } = req.body;
  const newCategory = await Category.create({
    name,
    priority,
    isFun,
    limitAmount,
    limitCount,
    userId: req.user.id,
  });
  res.status(200).json(newCategory);
});

/**
 * Deletes a category for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.delete("/category/:id", authenticateToken, async (req, res) => {
  try {
    const result = await Category.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    result
      ? res.status(200).json({ message: "Category deleted." })
      : res.status(404).json({ error: "Category not found." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves transactions for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/transactions", authenticateToken, async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { userId: req.user.id },
  });
  res.json(transactions);
});

/**
 * Records a new transaction for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post("/record-transaction", authenticateToken, async (req, res) => {
  const { type, amount, categoryName } = req.body;
  const category = await Category.findOne({
    where: { name: categoryName, userId: req.user.id },
  });
  const newTransaction = await Transaction.create({
    type,
    amount,
    categoryName,
    userId: req.user.id,
    alert: false,
  });

  if (
    category &&
    category.limitAmount &&
    amount > category.limitAmount &&
    !category.warned
  ) {
    newTransaction.alert = true;
    await newTransaction.save();
    category.warned = true;
    await category.save();
    res.status(201).json({
      message: "Transaction recorded, limit exceeded!",
      newTransaction,
    });
  } else {
    res.status(201).json(newTransaction);
  }
});

/**
 * Deletes a transaction for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.delete("/transaction/:id", authenticateToken, async (req, res) => {
  try {
    const result = await Transaction.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    result
      ? res.status(200).json({ message: "Transaction deleted." })
      : res.status(404).json({ error: "Transaction not found." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Retrieves budget information for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/budget", authenticateToken, async (req, res) => {
  try {
    const expenses = await Transaction.findAll({
      where: { userId: req.user.id, type: "Expense" },
      attributes: ["amount"],
      raw: true,
    });
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const incomes = await Transaction.findAll({
      where: { userId: req.user.id, type: "Income" },
      attributes: ["amount"],
      raw: true,
    });
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    const remainingBudget = totalIncome - totalExpenses;

    res.json({ totalIncome, totalExpenses, remainingBudget });
  } catch (error) {
    console.error("Failed to calculate budget:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Retrieves goals for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/goals", authenticateToken, async (req, res) => {
  const goals = await Goal.findAll({ where: { userId: req.user.id } });
  res.json(goals);
});

/**
 * Adds a new goal for a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.post("/goals", authenticateToken, async (req, res) => {
  const { type, targetAmount, period } = req.body;
  try {
    const newGoal = await Goal.create({
      type,
      targetAmount,
      period,
      userId: req.user.id,
      currentAmount: 0,
    });
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

syncDatabase().then(() => {
  app.listen(8080, () => console.log("Server running on port 8080"));
});
