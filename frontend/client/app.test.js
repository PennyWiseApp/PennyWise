const {
  addCategory,
  fetchCategories,
  recordTransaction,
  fetchTransactions,
} = require("./app");

const { resetDB, setupDB } = require("/testHelpers");

describe("Category Management", () => {
  beforeEach(async () => {
    await setupDB();
  });

  afterEach(async () => {
    await resetDB();
  });

  it("adds a new category successfully", async () => {
    document.body.innerHTML = `<input id="categoryName" value="Groceries">
       <input id="priority" value="5">
       <input id="isFun" type="checkbox" checked>`;
    await addCategory();
    const categories = await fetchCategories();
    expect(categories).toContainEqual({
      name: "Groceries",
      priority: 5,
      isFun: true,
    });
  });

  it("fails to add a category when required fields are missing", async () => {
    document.body.innerHTML = `<input id="categoryName" value="">
       <input id="priority" value="5">
       <input id="isFun" type="checkbox" checked>`;
    await expect(addCategory()).rejects.toThrow("Error adding category");
  });
});

describe("Transaction Management", () => {
  beforeEach(async () => {
    await setupDB();
  });

  afterEach(async () => {
    await resetDB();
  });

  it("records a transaction successfully", async () => {
    document.body.innerHTML = `<input name="transactionType" value="Income" checked>
       <input id="amount" value="1000">
       <input id="transactionCategory" value="Salary">`;
    await recordTransaction();
    const transactions = await fetchTransactions();
    expect(transactions).toContainEqual({
      type: "Income",
      amount: 1000,
      categoryName: "Salary",
    });
  });
});
