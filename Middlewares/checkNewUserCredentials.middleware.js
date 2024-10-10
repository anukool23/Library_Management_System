const mongoose = require('mongoose');
const UserModel = require("../Models/user.model");

// Combined middleware to check if email or username already exists
const checkNewUserCredentials = async (req, res, next) => {
  const username = req.body.username
  const email = req.body.email

  try {
    const userByEmail = await UserModel.findOne({ email: email });
    const userByUsername = await UserModel.findOne({ username: username });

    if (userByEmail && userByUsername) {
      console.log("Email and Username already exists ");
      return res.status(404).json({
        message: "Users with this Email and Username already exists. Either log in or create an account with a different combinations.",
        status: 0
      });
    }

    if (userByEmail) {
      console.log("Email exists in the database");
      return res.status(404).json({
        message: "User with this email already exists. Either log in or create an account with a different combinations.",
        status: 0
      });
    }

    if (userByUsername) {
      console.log("Username exists in the database");
      return res.status(404).json({
        message: "User with this username already exists. Either log in or create an account with a different combinations.",
        status: 0
      });
    }

    // If both checks pass, proceed to the next middleware
    next();

  } catch (err) {
    console.error("Error while checking email/username:", err);
    res.status(500).json({
      message: "Something went wrong, please try again after some time.",
      error: err
    });
  }
};

module.exports = checkNewUserCredentials;
