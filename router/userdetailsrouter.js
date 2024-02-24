const express = require("express");

const postRouter = express.Router();
const {
  postUserDetails,
  getUserDetails,
} = require("../controllers.js/userdetailscontroller");

postRouter.post("/signup", postUserDetails);

postRouter.post("/login", getUserDetails);
module.exports = postRouter;
