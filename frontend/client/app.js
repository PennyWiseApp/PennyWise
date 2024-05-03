document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".registerButton")
    .addEventListener("click", function () {
      register();
    });

  document.querySelector(".loginButton").addEventListener("click", function () {
    login();
  });
});

let token = "";

async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;

  console.log("Register clicked and ran!");
  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    toastr.success("Registration successful");
  } else {
    const error = await response.json();
    toastr.error(`Registration failed: ${error.message}`);
  }
}

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  console.log("Login clicked and ran!");
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    token = data.token;
    toastr.success("Login successful");
    fetchCategories();
    fetchTransactions();
    fetchBudget();
  } else {
    const error = await response.json();
    toastr.error(`Login failed: ${error.message}`);
  }
}

async function addCategory() {
  const categoryName = document.getElementById("categoryName").value;
  const priority = document.getElementById("priority").value;
  const isFun = document.getElementById("isFun").checked;

  const response = await fetch("/add-category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: categoryName,
      priority: parseInt(priority, 10),
      isFun,
    }),
  });

  if (response.ok) {
    toastr.success("Category added successfully");
    fetchCategories();
  } else {
    toastr.error("Error adding category");
  }
}

async function recordTransaction() {
  const type = document.querySelector(
    'input[name="transactionType"]:checked'
  ).value;
  const amount = document.getElementById("amount").value;
  const categoryName = document.getElementById("transactionCategory").value;

  const response = await fetch("/record-transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type, amount: parseFloat(amount), categoryName }),
  });

  if (response.ok) {
    toastr.success("Transaction recorded successfully");
    fetchTransactions();
  } else {
    toastr.error("Error recording transaction");
  }
}

async function fetchCategories() {
  const response = await fetch("/categories", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const categories = await response.json();
    const categoriesList = document.getElementById("categoriesList");
    categoriesList.innerHTML = "";

    categories.forEach((category) => {
      const entry = document.createElement("li");
      entry.textContent = `Category: ${category.name}, Priority: ${category.priority}, Is Fun: ${category.isFun}`;
      categoriesList.appendChild(entry);
    });
  }
}

async function fetchTransactions() {
  const response = await fetch("/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const transactions = await response.json();
    const transactionsList = document.getElementById("transactionsList");
    transactionsList.innerHTML = "";

    transactions.forEach((transaction) => {
      const entry = document.createElement("li");
      entry.textContent = `Type: ${transaction.type}, Amount: ${transaction.amount}, Category: ${transaction.categoryName}`;
      transactionsList.appendChild(entry);
    });
  }
}

async function fetchBudget() {
  const response = await fetch("/budget", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const data = await response.json();
    const budgetOverview = document.getElementById("budgetOverview");

    budgetOverview.innerHTML = `
      <p>Total Income: $${data.totalIncome.toFixed(2)}</p>
      <p>Total Expenses: $${data.totalExpenses.toFixed(2)}</p>
      <p>Remaining Budget: $${data.remainingBudget.toFixed(2)}</p>
    `;

    if (data.remainingBudget < 0) {
      toastr.error("You have exceeded your budget!");
    } else if (data.remainingBudget < data.totalIncome * 0.1) {
      toastr.warning("You're nearing your budget limit.");
    }
  }
}
