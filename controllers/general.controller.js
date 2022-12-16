const getMainPage = async (req, res) => {
  return res.render("main");
};

const getLoginPage = async (req, res) => {
  return res.render("login");
};

const login = async (req, res) => {
  if (req.body.email === "admin@pds.com") {
    if (req.body.password === "admin123123") {
      return res.redirect("/admin");
    } else {
      return res.render("loginError");
    }
  } else {
    const customer = { ssn: 753343245 };
    return res.redirect("/customers/" + customer.ssn);
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
