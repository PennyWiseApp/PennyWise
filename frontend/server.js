import express from "express";

const app = express();

app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

// In-memory storage for demonstration purposes
let categories = [];
let transactions = [];

// Route to add a new category
app.post("/add-category", (req, res) => {
  const { name, priority } = req.body;
  if (!name || priority === undefined) {
    return res.status(400).send("Missing name or priority for the category.");
  }
  const newCategory = { name, priority };
  categories.push(newCategory);
  res.status(201).send("Category added successfully.");
});

// Route to record a new transaction
app.post("/record-transaction", (req, res) => {
  const { type, amount, categoryName } = req.body;
  if (!type || amount === undefined || !categoryName) {
    return res.status(400).send("Missing transaction details.");
  }
  const newTransaction = { type, amount, categoryName };
  transactions.push(newTransaction);
  res.status(201).send("Transaction recorded successfully.");
});

// Route to get all categories
app.get("/categories", (req, res) => {
  res.json(categories);
});

// Route to get all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.listen(8080);
