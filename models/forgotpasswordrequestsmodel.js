const User = require("./userdetailsmodel");
const sequelize = require("../db/database");
const Sequelize = require("sequelize");

const Forgotpassword = sequelize.define("forgetpasswordrequests", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  active: Sequelize.BOOLEAN,
  expiresAt: Sequelize.DATE,
});
module.exports = Forgotpassword;
