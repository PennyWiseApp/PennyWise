import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

/**
 * Represents a user in the application.
 *
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 */
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

/**
 * The Category model representing a category in the PennyWise application.
 *
 * @type {import("sequelize").Model<Category>}
 */
const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 1,
      max: 10,
    },
  },
  limitAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: { min: 0 },
  },
  limitCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 0 },
  },
  warned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

/**
 * The Transaction model representing a transaction in the database.
 *
 * @type {import("sequelize").Model<Transaction>}
 */
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
  alert: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

/**
 * The Goal model representing a goal in the application.
 *
 * @type {import("sequelize").Model<Goal>}
 */
const Goal = sequelize.define("Goal", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currentAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Transaction, { foreignKey: "userId", onDelete: "CASCADE" });
Transaction.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Goal, { foreignKey: "userId", onDelete: "CASCADE" });
Goal.belongsTo(User, { foreignKey: "userId" });

async function syncDatabase() {
  await sequelize.sync({ force: true });
}

export { sequelize, User, Category, Transaction, Goal, syncDatabase };
