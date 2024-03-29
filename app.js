const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./db/database");
const helmet = require("helmet");
const path = require("path");
const postExpensesRouter = require("./router/expensedetailsrouter");
// app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
require("dotenv").config();

const postRouter = require("./router/userdetailsrouter");
const premiumRouter = require("./router/premiumaccountrouter");
const passwordRouter = require("./router/userpasswordresetrouter");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});
app.use(postRouter);
app.use(postExpensesRouter);
app.use(premiumRouter);
app.use(passwordRouter);

async function start() {
  try {
    await sequelize.sync();
    console.log("db connected");
    app.listen(process.env.PORT, () => {
      console.log("server is listening on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
}

start();
