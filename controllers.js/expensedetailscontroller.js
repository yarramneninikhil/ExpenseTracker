const Expenses = require("../models/expensedetailsmodel");
const jwt = require("jsonwebtoken");
const User = require("../models/userdetailsmodel");
const Sequelize = require("sequelize");
const FileStorage = require("../models/userfilesstoragemodel");
const sequelize = require("../db/database");
const AWS = require("aws-sdk");

async function postExpenseDetails(req, res) {
  const t = await sequelize.transaction();
  try {
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const createdExpense = await Expenses.create({
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      userId: decodedToken.userId,
    });
    const updatedUser = await User.update(
      {
        totalExpenses: Sequelize.literal(
          `totalExpenses + ${Number(req.body.amount)}`
        ),
      },
      {
        where: {
          id: decodedToken.userId,
        },
        returning: true,
      }
    );
    await t.commit();
    res.status(200).json(createdExpense);
  } catch (err) {
    await t.rollback();
    res.status(404).json({ error: "error in storing expenses" });
  }
}

async function getExpenses(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const userExpenses = await Expenses.findAll({
      where: {
        userId: decodedToken.userId,
      },
    });
    res.status(200).json(userExpenses);
  } catch (err) {
    res.status(404).json(err);
  }
}

async function deleteExpense(req, res) {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const deletedObject = await Expenses.destroy({
      where: {
        id: id,
      },
    });
    await t.commit();
    res.json("expense object deleted successfully");
  } catch (err) {
    await t.rollback();
    res.json("error in deleteting the object");
  }
}

async function reduceTotalExpense(req, res) {
  const t = await sequelize.transaction();
  try {
    const updateExpense = await User.update(
      {
        totalExpenses: Sequelize.literal(
          `totalExpenses - ${Number(req.body.amount)}`
        ),
      },
      {
        where: {
          id: req.body.userId,
        },
        returning: true,
      }
    );
    await t.commit();
    res.status(200).json(updateExpense);
  } catch (err) {
    await t.rollback();
    res.json({ Error: "Error in reducing total expenses" });
  }
}

async function downloadUserExpensesFile(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const userExpenses = await Expenses.findAll({
      where: {
        userId: decodedToken.userId,
      },
    });
    const { name } = await User.findOne({
      where: {
        id: decodedToken.userId,
      },
    });
    const stringyfiedExpenses = JSON.stringify(userExpenses);
    const s3 = new AWS.S3({
      accessKeyId: process.env.S3ACCESSKEY,
      secretAccessKey: process.env.S3SECRETACCESSKEY,
    });

    const params = {
      Bucket: "expensetrackerapp64",
      Key: `${name}-expensesfile`,
      Body: stringyfiedExpenses,
      ACL: "public-read",
    };

    const s3res = await s3.upload(params).promise();
    const fileInstance = await FileStorage.create({
      userId: decodedToken.userId,
      date: new Date(),
      url: s3res.Location,
    });
    res.json({ fileurl: s3res.Location });
  } catch (err) {
    res.json({ Error: "error in upload file to aws" });
  }
}

async function getExpensesPerPage(req, res) {
  try {
    const pageSize = +req.query.pageSize;
    const pageNumber = +req.query.pageNumber;
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const size = pageSize > 600 ? 7 : 4;
    const offset = (pageNumber - 1) * size;
    const userExpenses = await Expenses.findAll({
      where: {
        userId: decodedToken.userId,
      },
      limit: size,
      offset: offset,
    });

    res.status(200).json(userExpenses);
  } catch (err) {
    res.status(404).json(err);
  }
}

async function getUserFiles(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const dowloadedFiles = await FileStorage.findAll({
      where: {
        userId: decodedToken.userId,
      },
    });
    res.status(200).json({ files: dowloadedFiles });
  } catch (err) {
    res.json({ Error: "error in getting files" });
  }
}

module.exports = {
  postExpenseDetails,
  getExpenses,
  deleteExpense,
  reduceTotalExpense,
  downloadUserExpensesFile,
  getExpensesPerPage,
  getUserFiles,
};
