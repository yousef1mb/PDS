const jwt = require("jsonwebtoken");
let { User } = require("../models");

exports.userAuth = (req, res, next) => {
  const token = req.cookies.token;
  let payload;
  if (!token) return res.render("loginError");
  try {
    payload = jwt.verify(token, "PDS secret to verify tokens");
  } catch (e) {
    return res.status(400).render("loginError");
  }
  req.user = payload;
  next();
};
