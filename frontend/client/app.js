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
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        deleteCategory(category.id);
      });
      entry.appendChild(deleteBtn);
      categoriesList.appendChild(entry);
    });
  } else {
    showToast("Failed to load categories", "error");
  }
}

/**
 * Deletes a category by sending a DELETE request to the server.
 * @param {string} categoryId - The ID of the category to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the category is deleted successfully.
 */
async function deleteCategory(categoryId) {
  const response = await fetch(`/category/${categoryId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    showToast("Category deleted", "success");
    fetchCategories();
  } else {
    const error = await response.json();
    showToast(`Delete failed: ${error.message}`, "error");
  }
}

/**
 * Records a transaction by sending a POST request to the server.
 * @async
 */
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
 * Fetches transactions from the server and updates the transactions list in the UI.
 * @returns {Promise<void>} A promise that resolves when the transactions are fetched and updated.
 */
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
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        deleteTransaction(transaction.id);
      });
      entry.appendChild(deleteBtn);
      transactionsList.appendChild(entry);
    });
  } else {
    showToast("Failed to load transactions", "error");
  }
}

/**
 * Deletes a transaction with the specified transaction ID.
 * @param {string} transactionId - The ID of the transaction to delete.
 * @returns {Promise<void>} - A promise that resolves when the transaction is deleted.
 */
async function deleteTransaction(transactionId) {
  const response = await fetch(`/transaction/${transactionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.ok) {
    showToast("Transaction deleted", "success");
    fetchTransactions();
  } else {
    const error = await response.json();
    showToast(`Delete failed: ${error.message}`, "error");
  }
}

/**
 * Calculates the budget by making a request to the "/budget" endpoint and updating the budget output on the page.
 * @returns {Promise<void>} A promise that resolves when the budget is calculated successfully.
 */
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
 * Fetches budget data and goals from the server and updates the budget overview on the webpage.
 * @returns {Promise<void>} A promise that resolves when the budget data and goals are fetched and the budget overview is updated.
 */
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

/**
 * Displays a toast message on the screen.
 * @param {string} message - The message to be displayed in the toast.
 * @param {string} type - The type of the toast (e.g., "success", "error", "warning").
 */
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

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".registerBtn").addEventListener("click", function () {
    register();
  });

  document.querySelector(".loginBtn").addEventListener("click", function () {
    login();
  });

  const toggleLinks = document.querySelectorAll(".toggle");
  toggleLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const loginForm = document.querySelector(".login-form");
      const registerForm = document.querySelector(".register-form");
      if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
      } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
      }
    });
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
