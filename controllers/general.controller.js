const getMainPage = async (req, res) => {
  return res.render("main");
};

const getLoginPage = async (req, res) => {
  return res.render("login");
};

const login = async (req, res) => {};

const logout = async (req, res) => {};

module.exports = {
  getMainPage,
  getLoginPage,
  login,
  logout,
};
