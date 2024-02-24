const Sequelize = require("sequelize");
const sequelize = require("../db/database");
const User = require("../models/userdetailsmodel");
const FileStorage = sequelize.define("filestorage", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = FileStorage;
