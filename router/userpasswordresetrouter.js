const express = require("express");
const passwordRouter = express.Router();
const {
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers.js/passwordforgetcontroller");
passwordRouter.post("/password/forgotpassword", forgotPassword);
passwordRouter.get("/password/resetpassword/:id", resetPassword);
passwordRouter.post("/password/updatepassword/:id", updatePassword);

module.exports = passwordRouter;
