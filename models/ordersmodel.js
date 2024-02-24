const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const User = require("./userdetailsmodel");
const CreateOrder = sequelize.define("orders", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: Sequelize.STRING,
  payment_id: Sequelize.STRING,
  status: {
    type: Sequelize.STRING,
    defaultValue: "pending",
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

module.exports = CreateOrder;
