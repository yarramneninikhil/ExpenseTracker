const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  totalExpenses: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
module.exports = User;
