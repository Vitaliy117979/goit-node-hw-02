const bcrypt = require("bcrypt");
const HttpError = require("../../helpers/HttpError");
const User = require("../../models/user");
const gravatar = require("gravatar")
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email is use");
    }

    const createHashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email)
    const newUser = await User.create({
      ...req.body,
      password: createHashPassword,
      avatarURL,
    });
    const subscription = req.body.subscription || "starter";
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription,
      },
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
