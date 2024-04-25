let db;

document.addEventListener("DOMContentLoaded", function () {
  let request = window.indexedDB.open("BudgetDB", 1);

  request.onerror = function (event) {
    alert("Database error: " + event.target.errorCode);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    fetchCategories();
    fetchTransactions();
  };

  request.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.createObjectStore("categories", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("transactions", {
      keyPath: "id",
      autoIncrement: true,
    });
  };
});

async function addCategory() {
  const categoryName = document.querySelector("#categoryName").value;
  const priority = document.querySelector("#priority").value;
  const isFun = document.querySelector("#isFun").checked;

  const transaction = db.transaction(["categories"], "readwrite");
  const store = transaction.objectStore("categories");
  let request = store.add({
    name: categoryName,
    priority: parseInt(priority, 10),
    isFun,
  });

  request.onsuccess = function () {
    alert("Category added successfully");
    fetchCategories();
  };

  request.onerror = function (e) {
    alert("Error adding category: " + e.target.error.message);
  };
}

async function fetchCategories() {
  const transaction = db.transaction(["categories"], "readonly");
  const store = transaction.objectStore("categories");
  let request = store.openCursor();
  const categoriesList = document.getElementById("categoriesList");
  categoriesList.innerHTML = "";

  request.onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      const entry = document.createElement("li");
      entry.textContent = `Category: ${cursor.value.name}, Priority: ${cursor.value.priority}, Is Fun: ${cursor.value.isFun}`;
      categoriesList.appendChild(entry);
      cursor.continue();
    }
  };
}

async function recordTransaction() {
  const type = document.querySelector(
    'input[name="transactionType"]:checked'
  ).value;
  const amount = document.getElementById("amount").value;
  const categoryName = document.getElementById("transactionCategory").value;

  const transaction = db.transaction(["transactions"], "readwrite");
  const store = transaction.objectStore("transactions");
  let request = store.add({ type, amount: parseFloat(amount), categoryName });

  request.onsuccess = function () {
    alert("Transaction recorded successfully");
    fetchTransactions();
  };

  request.onerror = function (e) {
    alert("Error recording transaction: " + e.target.error.message);
  };
}

async function fetchTransactions() {
  const transaction = db.transaction(["transactions"], "readonly");
  const store = transaction.objectStore("transactions");
  let request = store.openCursor();
  const transactionsList = document.getElementById("transactionsList");
  transactionsList.innerHTML = "";

  request.onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      const entry = document.createElement("li");
      entry.textContent = `Type: ${cursor.value.type}, Amount: ${cursor.value.amount}, Category: ${cursor.value.categoryName}`;
      transactionsList.appendChild(entry);
      cursor.continue();
    }
  };
}

async function fetchBudget() {
  console.log("Fetch budget data from IndexedDB or server");
}
