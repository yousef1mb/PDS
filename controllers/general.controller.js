const { User } = require("../models/dbObj");

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

  const isAdmin = await User.isAdmin(user.U_SSN);

  if (isAdmin) {
    return res.redirect("/admin");
  } else {
    return res.redirect("/customers/" + user.U_SSN);
  }
  // if (req.body.email === "admin@pds.com") {
  //   if (req.body.password === "admin123123") {
  //   } else {
  //     return res.render("loginError");
  //   }
  // } else {
  //   const customer = { ssn: 753343245 };
  // }
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
