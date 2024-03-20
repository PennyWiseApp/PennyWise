import * as bgt from "./budgetmanager.py";

import express from "express";

const app = express();

app.use(express.static("client", { extensions: ["html"] }));

function getBudget(req, res) {
  res.json(bgt.listBudgets());
}

function getBudget(req, res) {
  const result = bgt.findBudget(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("No match for that ID.");
  }
}

function saveBudget(req, res) {
  const budgets = bgt.addWorkout(req.body.msg);
  res.json(budgets);
}

function editBudget(req, res) {
  const budget = bgt.editBudget(req.body);
  res.json(budget);
}

app.get("/Budgets", getBudgets);
app.get("/Budgets/:id", getBudget);
app.post("/Budgets", express.json(), saveBudget);
app.put("/Budgets/:id", express.json(), editBudget);

app.listen(8080);
