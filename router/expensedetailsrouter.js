const express = require("express");
const {
  postExpenseDetails,
  getExpenses,
  deleteExpense,
  reduceTotalExpense,
  downloadUserExpensesFile,
  getExpensesPerPage,
  getUserFiles,
} = require("../controllers.js/expensedetailscontroller");

const postExpensesRouter = express.Router();

postExpensesRouter.post("/userexpense", postExpenseDetails);
postExpensesRouter.get("/userexpenses", getExpenses);
postExpensesRouter.delete("/deleteexpense/:id", deleteExpense);
postExpensesRouter.post("/reducetotalexpense", reduceTotalExpense);
postExpensesRouter.get("/download", downloadUserExpensesFile);
postExpensesRouter.get("/expensesperpage", getExpensesPerPage);
postExpensesRouter.get("/files", getUserFiles);
module.exports = postExpensesRouter;
