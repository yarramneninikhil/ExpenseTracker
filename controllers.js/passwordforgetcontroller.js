const uuid = require("uuid");
const User = require("../models/userdetailsmodel");
const Forgotpassword = require("../models/forgotpasswordrequestsmodel");
const createError = require("http-errors");
const Sib = require("sib-api-v3-sdk");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });

    if (user) {
      const id = uuid.v4();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      const passwordrequest = await Forgotpassword.create({
        id: id,
        userId: user.dataValues.id,
        active: true,
        expiresAt: expiresAt,
      });

      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "yarramneninikhil@gmail.com",
      };

      const receivers = [
        {
          email: email,
        },
      ];

      // Send the email and handle the response
      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "Expense Tracker Password reset",
          textContent: "here you can reset your password",
          htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`,
        })
        .then((result) => {
          res.status(200).json("successfully sent the mail");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.status(500).json({ Error: "Error in sending mail" });
        });
    } else {
      throw createError(400, "User does not Exist");
    }
  } catch (err) {
    console.error("Error in forgotPassword function:", err);
    if (err.status == 400 && err.message) {
      res.status(err.status).json(err.message);
    } else {
      res.status(500).json({ Error: "Internal server error" });
    }
  }
}

async function resetPassword(req, res) {
  try {
    const id = req.params.id;

    const activeUser = await Forgotpassword.findOne({
      where: {
        id: id,
        active: true,
        expiresAt: {
          [Sequelize.Op.gte]: new Date(),
        },
      },
    });

    if (activeUser) {
      const updatePassword = await Forgotpassword.update(
        { active: false },
        {
          where: {
            id: id,
          },
          returning: true,
        }
      );
      res.send(`<html>
          <form action="/password/updatepassword/${id}" method="POST">
              <label for="newpassword">Enter New password</label>
              <input name="newpassword" type="password" required></input>
              <button>reset password</button>
          </form>
      </html>`);
    } else {
      throw createError(404, "Password reset link not found or expired");
    }
  } catch (err) {
    console.error("Error in resetPassword function:", err);
    if (err.status && err.message) {
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send("Internal server error");
    }
  }
}

async function updatePassword(req, res) {
  try {
    const { newpassword } = req.body;
    const password = await bcrypt.hash(newpassword, 10);
    const id = req.params.id;
    const user = await Forgotpassword.findOne({
      where: {
        id: id,
      },
    });
    const updatepassword = await User.update(
      {
        password: password,
      },
      {
        where: {
          id: user.dataValues.userId,
        },
      }
    );
    res.json("password successfully updated");
  } catch (errr) {
    res.json({ Error: "Error in updating password" });
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
  updatePassword,
};
