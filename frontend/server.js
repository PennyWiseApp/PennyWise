import express from "express";

const app = express();

app.use(express.static("client", { extensions: ["html"] }));
app.use(express.json());

let categories = [];
let transactions = [];

app.post("/add-category", (req, res) => {
  const { name, priority, isFun } = req.body;
  if (!name || priority === undefined || isFun === undefined) {
    return res
      .status(400)
      .json({
        error:
          "Missing required category details: 'name', 'priority', or 'isFun'.",
      });
  }
  const newCategory = { name, priority, isFun };
  categories.push(newCategory);
  res
    .status(200)
    .json({ message: "Category added successfully", category: newCategory });
});

app.post("/record-transaction", (req, res) => {
  const { type, amount, categoryName } = req.body;
  if (!type || amount === undefined || !categoryName) {
    return res
      .status(400)
      .json({
        error:
          "Missing transaction details: 'type', 'amount', or 'categoryName'.",
      });
  }
  const newTransaction = { type, amount, categoryName };
  transactions.push(newTransaction);
  res
    .status(201)
    .json({
      message: "Transaction recorded successfully",
      transaction: newTransaction,
    });
});

app.get("/categories", (req, res) => {
  res.json(categories);
});

app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.get("/budget", (req, res) => {
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
  const funCategories = categories.filter((category) => category.isFun);
  const funPotAmount =
    funCategories.length > 0 ? remainingBudget / funCategories.length : 0;

  res.json({ totalIncome, totalExpenses, remainingBudget, funPotAmount });
});

app.listen(8080, () => console.log("Server running on port 8080"));
