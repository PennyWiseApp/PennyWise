// database.js
import { Sequelize, DataTypes } from "sequelize";

// Change the database storage to a file instead of memory if persistent storage is needed
// For example: const sequelize = new Sequelize('sqlite:data/database.db');
const sequelize = new Sequelize("sqlite::memory:"); // In-memory database for testing, change for production

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isFun: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

const Transaction = sequelize.define("Transaction", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Define relationships
User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

// Async function to handle database synchronization
async function syncDatabase() {
  await sequelize.sync({ force: false }); // Set force: true to drop/recreate tables
}

// Export models and database functions
export { sequelize, User, Category, Transaction, syncDatabase };
