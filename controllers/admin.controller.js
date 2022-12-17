const { User, Package } = require("../models/dbObj");
const { ID } = require("../utils");

const getAdminPage = async (req, res) => {
  const admin = req.user;
  res.render("admin/main", { admin });
};

const getReportsPage = async (req, res) => {
  let customers = await User.getAll();

  customers = customers.filter(async (customer) => {
    let isAdmin = await User.isAdmin(customer.U_SSN);

    return !isAdmin;
  });
  return res.render("admin/reports", { customers });
};

const addPackage = async (req, res) => {
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
    Sender_SSN: parseInt(req.body.from),
    Reciever_SSN: parseInt(req.body.to),
    Weight: parseFloat(req.body.weight),
  };
  const isAdded = await Package.create(package);

  if (isAdded) {
    return res.redirect("/admin/packages");
  }
  return res.redirect("/admin");
};

const removePackage = async (req, res) => {
  const package = await Package.get(req.params.num);
  const isRemoved = await Package.delete(package);

  if (isRemoved) {
    return res.redirect("/admin/packages");
  } else {
    return res.redirect("/admin");
  }
};

const editPackage = async (req, res) => {
  let insurance = parseFloat(req.body.value) * 1.11 * 0.2;
  const package = {
    PackageNum: req.params.num,
    pValue: parseFloat(req.body.value),
    Category: req.body.category,
    FinalDeliveryDate: req.body.finalDate,
    Width: parseFloat(req.body.width),
    Height: parseFloat(req.body.height),
    Length: parseFloat(req.body.length),
    RtlCenter_ID: parseInt(req.body.retail),
    Insurance_amount: parseFloat(insurance),
    Weight: parseFloat(req.body.weight),
  };
  const isUpdated = await Package.update(package);

  if (isUpdated) {
    return res.redirect("/admin/packages/" + req.params.num);
  } else {
    return res.redirect("/admin");
  }
};

const addUser = async (req, res) => {
  const user = {
    U_SSN: req.body.ssn,
    Fname: req.body.fname,
    Mname: req.body.mname,
    Lname: req.body.lname,
    Phone: req.body.phone,
    Email: req.body.email,
    Password: req.body.password,
  };

  await User.create(user);

  if (req.body.role === "admin") {
    await User.setAdmin(req.body.ssn);
  } else {
    await User.setCustomer(req.body.ssn);
  }

  return res.redirect("/admin/users");
};

const removeUser = async (req, res) => {
  const user = await User.getBySSN(req.params.ssn);
  const isRemoved = await User.delete(user);

  if (isRemoved) {
    return res.redirect("/admin/users");
  } else {
    return res.redirect("/admin");
  }
};

const editUser = async (req, res) => {
  const user = {
    U_SSN: req.params.ssn,
    Fname: req.body.fname,
    Mname: req.body.mname,
    Lname: req.body.lname,
    Phone: req.body.phone,
    Email: req.body.email,
    Password: req.body.password,
  };

  const isUpdated = await User.update(user);

  if (isUpdated) {
    return res.redirect("/admin/users/" + req.params.ssn);
  } else {
    return res.redirect("/admin");
  }
};

const getPayments = async (req, res) => {};

const getPackagesBasedOnStatus = async (req, res) => {};

const getPackagesBasedOnTypes = async (req, res) => {};

const getPackagesBasedOnCustomer = async (req, res) => {};

const getTrackedPackages = async (req, res) => {};

const getPackages = async (req, res) => {
  const packages = await Package.getAll();
  let customers = await User.getAll();

  customers = customers.filter(async (customer) => {
    let isAdmin = await User.isAdmin(customer.U_SSN);

    return !isAdmin;
  });

  return res.render("admin/packages", { customers, packages });
};

const getPackage = async (req, res) => {
  const packageBasic = await Package.get(req.params.num);

  //const tracers = await Package.getPackageTraceback(packageBasic)

  const package = { ...packageBasic, tracers: [] };
  return res.render("admin/package", { package });
};

const getUsers = async (req, res) => {
  let users = await User.getAll();

  const getWithPromiseAll = async () => {
    users = await Promise.all(
      users.map(async (user) => {
        const isAdmin = await User.isAdmin(user.U_SSN);

        return { ...user, role: isAdmin ? "Admin" : "Customer" };
      })
    );
  };
  await getWithPromiseAll();

  return res.render("admin/users", { users });
};

const getUser = async (req, res) => {
  const user = await User.getBySSN(req.params.ssn);

  return res.render("admin/user", { user });
};

module.exports = {
  addPackage,
  addUser,
  removePackage,
  removeUser,
  editPackage,
  editUser,
  getAdminPage,
  getReportsPage,
  getPayments,
  getPackagesBasedOnStatus,
  getPackagesBasedOnTypes,
  getPackagesBasedOnCustomer,
  getTrackedPackages,
  getPackage,
  getPackages,
  getUsers,
  getUser,
};
