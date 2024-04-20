// Function to add a new category
async function addCategory() {
  const categoryName = document.getElementById("categoryName").value;
  const priority = document.getElementById("priority").value;

  try {
    const response = await fetch("/add-category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: categoryName,
        priority: parseInt(priority, 10),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add category");
    }

    alert("Category added successfully");
    fetchCategories(); // Refresh the categories list
  } catch (error) {
    console.error("Error:", error);
    alert("Error adding category");
  }
}

// Function to record a new transaction
async function recordTransaction() {
  const type = document.querySelector(
    'input[name="transactionType"]:checked'
  ).value;
  const amount = document.getElementById("amount").value;
  const categoryName = document.getElementById("transactionCategory").value;

  try {
    const response = await fetch("/record-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, amount: parseFloat(amount), categoryName }),
    });

    if (!response.ok) {
      throw new Error("Failed to record transaction");
    }

    alert("Transaction recorded successfully");
    fetchTransactions(); // Refresh the transactions list
  } catch (error) {
    console.error("Error:", error);
    alert("Error recording transaction");
  }
}

// Function to fetch and display categories
async function fetchCategories() {
  try {
    const response = await fetch("/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const categories = await response.json();
    const categoriesList = document.getElementById("categoriesList");
    categoriesList.innerHTML = ""; // Clear existing entries
    categories.forEach((category) => {
      const entry = document.createElement("li");
      entry.textContent = `Category: ${category.name}, Priority: ${category.priority}`;
      categoriesList.appendChild(entry);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching categories");
  }
}

// Function to fetch and display transactions
async function fetchTransactions() {
  try {
    const response = await fetch("/transactions");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const transactions = await response.json();
    const transactionsList = document.getElementById("transactionsList");
    transactionsList.innerHTML = ""; // Clear existing entries
    transactions.forEach((transaction) => {
      const entry = document.createElement("li");
      entry.textContent = `Type: ${transaction.type}, Amount: ${transaction.amount}, Category: ${transaction.categoryName}`;
      transactionsList.appendChild(entry);
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching transactions");
  }
}

// Initial fetch of categories and transactions to display existing ones
document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchTransactions();
});
