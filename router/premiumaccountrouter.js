const express = require("express");
const premiumRouter = express();
const {
  buyPremium,
  updateOrderStatus,
  getUserTotalExpenses,
} = require("../controllers.js/premiumdetailscontroller");

premiumRouter.get("/leaderboard", getUserTotalExpenses);
premiumRouter.post("/buypremiumaccount", buyPremium);
premiumRouter.post("/premiumpayment", updateOrderStatus);
module.exports = premiumRouter;
