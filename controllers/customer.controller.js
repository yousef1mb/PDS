const { ID } = require("../utils");
const { User, Package, Payment } = require("../models/dbObj");

const getCustomerPage = async (req, res) => {
  const { user: customer } = req.user;
  return res.render("customer/main", { customer });
};

const getSentPackages = async (req, res) => {
  const { user: customer } = req.user;
  let customers = await User.getAll();

  const packages = await Package.getSentPckgs(customer.U_SSN);
  customers = customers.filter((item) => item.U_SSN != customer.U_SSN);
  customers = customers.filter(async () => {
    const isAdmin = await User.isAdmin(item.U_SSN);

    !isAdmin;
  });

  return res.render("customer/sentPackages", { customer, customers, packages });
};

const getRecievedPackages = async (req, res) => {
  const { user: customer } = req.user;

  const packages = await Package.getRecievedPckgs(customer.U_SSN);

  return res.render("customer/recievedPackages", { customer, packages });
};

const getPackage = async (req, res) => {
  const { user: customer } = req.user;

  let package = await Package.get(req.query.q);

  package = { ...package, tracers: [] };

  return res.render("customer/package", { package, customer });
};

const send = async (req, res) => {
  let insurance = parseFloat(req.body.value) * 1.11 * 0.2;
  const package = {
    PackageNum: ID(),
    pValue: parseFloat(req.body.value),
    Category: req.body.category,
    FinalDeliveryDate: req.body.finalDate,
    Width: parseFloat(req.body.width),
    Height: parseFloat(req.body.height),
    Length: parseFloat(req.body.length),
    RtlCenter_ID: parseInt(req.body.retail),
    Insurance_amount: parseFloat(insurance),
    Sender_SSN: req.params.customer_id,
    Reciever_SSN: parseInt(req.body.to),
    Weight: parseFloat(req.body.weight),
  };
  const isAdded = await Package.create(package);

  if (isAdded) {
    return res.redirect(
      "/customers/" + req.params.customer_id + "/packages/sent"
    );
  }
  return res.redirect("/customers/" + req.params.customer_id);
};

const recieve = async (req, res) => {};

const getUpdatePage = async (req, res) => {
  const { user: customer } = req.user;

  return res.render("customer/account", { customer });
};

const updateInformation = async (req, res) => {
  const user = {
    U_SSN: req.params.customer_id,
    Fname: req.body.fname,
    Mname: req.body.mname,
    Lname: req.body.lname,
    Phone: req.body.phone,
    Email: req.body.email,
    Password: req.body.password,
  };

  const isUpdated = await User.update(user);

  if (isUpdated) {
    return res.redirect("/customers/" + req.params.customer_id + "/update");
  } else {
    return res.redirect("/customers/" + req.params.customer_id);
  }
};

const getPaymentPage = async (req, res) => {
  const { user: customer } = req.user;

  const package = await Package.get(req.params.pkgnum);

  let amount = 0;
  let weight = package.Weight;

  if (weight <= 25) {
    amount = 15;
  } else if (weight <= 50) {
    amount = 28;
  } else if (weight <= 100) {
    amount = 55;
  } else {
    amount = 100;
  }

  return res.render("customer/payment", { customer, amount });
};

const doPayment = async (req, res) => {
  const payment = {
    Usr_SSN: req.params.customer_id,
    PackageNum: req.params.pkgnum,
    Amount: req.body.amount,
  };
  await Payment.add(payment);

  return res.redirect("/customers/" + req.params.customer_id);
};

module.exports = {
  getCustomerPage,
  getPackage,
  getPaymentPage,
  getRecievedPackages,
  getSentPackages,
  getUpdatePage,
  doPayment,
  updateInformation,
  send,
  recieve,
};
