const { User } = require("../models/dbObj");
const jwt = require("jsonwebtoken");

const getMainPage = async (req, res) => {
  return res.render("main");
};

const getLoginPage = async (req, res) => {
  return res.render("login");
};

const login = async (req, res) => {
  const user = await User.getByEmail(req.body.email);
  if (!user) {
    return res.render("loginError");
  }

  if (user.Password !== req.body.password) {
    return res.render("loginError");
  }

  const token = jwt.sign({ user }, "PDS secret to verify tokens");
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + 120 * 24 * 60 * 60 * 1000 // 120 days
    ),
    httpOnly: true,
  });

  const isAdmin = await User.isAdmin(user.U_SSN);

  if (isAdmin) {
    return res.redirect("/admin");
  } else {
    return res.redirect("/customers/" + user.U_SSN);
  }
};

const logout = async (req, res) => {
  return res.redirect("/");
};

module.exports = {
  getMainPage,
  getLoginPage,
  login,
  logout,
};
