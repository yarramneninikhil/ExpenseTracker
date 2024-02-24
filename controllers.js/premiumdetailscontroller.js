const Razorpay = require("razorpay");
const CreateOrder = require("../models/ordersmodel");
const jwt = require("jsonwebtoken");
const User = require("../models/userdetailsmodel");

async function buyPremium(req, res) {
  try {
    const { amount } = req.body;
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEYID,
      key_secret: process.env.RAZORPAY_KEYSECRET,
    });
    razorpayInstance.orders.create({ amount }, async (err, order) => {
      if (!err) {
        const newOrder = await CreateOrder.create({
          order_id: order.id,
          userId: decodedToken.userId,
        });
        res.json({ orderId: order.id, userId: decodedToken.userId });
      } else res.send(err);
    });
  } catch (err) {
    res.json({ Error: "Error in creating order" });
  }
}

async function updateOrderStatus(req, res) {
  const { order_id, payment_id } = req.body;
  try {
    const order = await CreateOrder.findOne({
      where: {
        order_id: order_id,
      },
    });

    if (order) {
      const resStatus = await order.update({
        payment_id: payment_id,
        status: "success",
      });
      res.status(200).json(resStatus);
    } else {
      const fialedStatus = await order.update({
        payment_id: payment_id,
        status: "failed",
      });
      res.status(400).json({ Error: "Payment Failed" });
    }
  } catch (err) {
    if (err.status && err.message) {
      res.status(400).json({ Error: "Payment Failed" });
    } else {
      res.status(500).json({ Error: "Internal Server Error" });
    }
  }
}

async function getUserTotalExpenses(req, res) {
  try {
    const authorization = req.headers.authorization;
    const decodedToken = jwt.verify(authorization, process.env.JWT_SECRETKEY);
    const totalExpenses = await User.findAll({
      attributes: ["name", "totalExpenses"],
    });
    res.json(totalExpenses);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  buyPremium,
  updateOrderStatus,
  getUserTotalExpenses,
};
