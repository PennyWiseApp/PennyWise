document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".registerBtn").addEventListener("click", function () {
    register();
  });

  document.querySelector(".loginBtn").addEventListener("click", function () {
    login();
  });
  document.querySelector(".logoutBtn").addEventListener("click", function () {
    token = "";
    window.location.reload();
  });

  document
    .querySelector(".addCategoryBtn")
    .addEventListener("click", function () {
      addCategory();
    });
  document
    .querySelector(".recordTransactionBtn")
    .addEventListener("click", function () {
      recordTransaction();
    });
  document
    .querySelector(".refreshBudgetBtn")
    .addEventListener("click", function () {
      fetchBudget();
    });
  document.querySelector(".setGoalBtn").addEventListener("click", function () {
    setGoal();
  });
});

let token = "";

/**
 * Registers a user by sending a POST request to the server.
 * @async
 * @function register
 */
async function register() {
  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    showToast("Registration successful", "success");
  } else {
    const error = await response.json();
    showToast(`Registration failed: ${error.message}`, "error");
  }
}

/**
 * Logs in the user by sending a POST request to the server with the provided username and password.
 * If the login is successful, it retrieves the user's token and performs additional fetch requests.
 */
async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    token = data.token;
    showToast("Login successful", "success");
    fetchCategories();
    fetchTransactions();
    fetchBudget();
  } else {
    const error = await response.json();
    showToast(`Login failed: ${error.message}`, "error");
  }
}

/**
 * Adds a category to the application.
 * @async
 * @function addCategory
 */
async function addCategory() {
  const categoryName = document.getElementById("categoryName").value;
  const priority = document.getElementById("priority").value;
  const limitAmount = document.getElementById("limitAmount").value || null;
  const limitCount = document.getElementById("limitCount").value || null;

  const response = await fetch("/add-category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: categoryName,
      priority: parseInt(priority, 10),
      limitAmount: parseFloat(limitAmount),
      limitCount: parseInt(limitCount, 10),
    }),
  });

  if (response.ok) {
    showToast("Category added successfully", "success");
    fetchCategories();
  } else {
    const error = await response.json();
    showToast(`Error adding category: ${error.message}`, "error");
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
    showToast("Transaction recorded successfully", "success");
    fetchTransactions();
  } else {
    const error = await response.json();
    showToast(`Error recording transaction: ${error.message}`, "error");
  }
}

/**
 * Fetches categories from the server and updates the UI.
 * @returns {Promise<void>} A promise that resolves when the categories are fetched and the UI is updated.
 */
async function fetchCategories() {
  const response = await fetch("/categories", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const transactionCategorySelect = document.getElementById(
    "transactionCategory"
  );

  if (response.ok) {
    const categories = await response.json();
    transactionCategorySelect.innerHTML = categories
      .map(
        (category) =>
          `<option value="${category.name}">${category.name}</option>`
      )
      .join("");
    categoriesList.innerHTML = "";
    categories.forEach((category) => {
      const entry = document.createElement("li");
      entry.textContent = `Category: ${category.name}, Priority: ${category.priority}`;
      categoriesList.appendChild(entry);
    });
  } else {
    showToast("Failed to load categories", "error");
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
      entry.textContent = `Type: ${
        transaction.type
      }, Amount: ${transaction.amount.toFixed(2)}, Category: ${
        transaction.categoryName
      }`;
      transactionsList.appendChild(entry);
    });
  } else {
    showToast("Failed to load transactions", "error");
  }
}

async function fetchBudget() {
  console.log("Fetching budget data...");
  try {
    const response = await fetch("/budget", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch budget");
    }
    const data = await response.json();
    console.log("Budget data:", data);

    const goalsResponse = await fetch("/goals", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!goalsResponse.ok) {
      throw new Error("Failed to fetch goals");
    }
    const goalsData = await goalsResponse.json();
    console.log("Goals data:", goalsData);

    const budgetOverview = document.getElementById("budgetOverview");
    budgetOverview.innerHTML = `
      <p>Total Income: ${data.totalIncome.toFixed(2)}</p>
      <p>Total Expenses: ${data.totalExpenses.toFixed(2)}</p>
      <p>Remaining Budget: ${data.remainingBudget.toFixed(2)}</p>
      <h3>Goals:</h3>
      <ul>${goalsData
        .map(
          (goal) =>
            `<li>${goal.type} - ${goal.targetAmount.toFixed(2)}, Period: ${
              goal.period
            }, Current: ${goal.currentAmount.toFixed(2)}</li>`
        )
        .join("")}</ul>
    `;
  } catch (error) {
    console.error("Error fetching budget or goals:", error);
    showToast("Failed to load budget overview", "error");
  }
}

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    toast.ontransitionend = () => toast.remove();
  }, 3000);
}

async function calculateBudget() {
  const response = await fetch("/budget", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    const data = await response.json();
    const budgetOutput = document.getElementById("budgetOutput");
    budgetOutput.innerHTML = `
      <p>Total Income: ${data.totalIncome.toFixed(2)}</p>
      <p>Total Expenses: ${data.totalExpenses.toFixed(2)}</p>
      <p>Remaining Budget: ${data.remainingBudget.toFixed(2)}</p>
    `;
    showToast("Budget calculated successfully", "success");
  } else {
    showToast("Failed to calculate budget", "error");
  }
}

/**
 * Sets a goal by sending a POST request to the server.
 * @async
 * @function setGoal
 */
async function setGoal() {
  const type = document.querySelector('input[name="goalType"]:checked').value;
  const targetAmount = document.getElementById("goalAmount").value;
  const period = document.getElementById("goalPeriod").value;

  const response = await fetch("/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      targetAmount: parseFloat(targetAmount),
      period,
    }),
  });

  if (response.ok) {
    showToast("Goal set successfully", "success");
  } else {
    const error = await response.json();
    showToast(`Error setting goal: ${error.message}`, "error");
  }
}
