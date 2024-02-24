const User = require("../models/userdetailsmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
async function postUserDetails(req, res) {
  try {
    const hashPassword = async () => {
      const hash = await bcrypt.hash(req.body.password, 10);
      return hash;
    };
    const existUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!existUser) {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: await hashPassword(),
      });
      res
        .status(200)
        .json({ message: "User logged successfully", user: newUser });
    } else {
      throw createError(409, "User already exists");
    }
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function getUserDetails(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const isPasswordTrue = await bcrypt.compare(
        password,
        user.dataValues.password
      );

      if (isPasswordTrue) {
        const payload = {
          userId: user.dataValues.id,
        };
        const secretKey = process.env.JWT_SECRETKEY;
        const option = {};
        const accessKey = jwt.sign(payload, secretKey, option);
        res.status(200).json({ accessKey });
      } else {
        throw createError(409, "User details not valid");
      }
    } else {
      // User not found
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    if (err.status && err.message) {
      return res.status(err.status).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
module.exports = {
  postUserDetails,
  getUserDetails,
};
