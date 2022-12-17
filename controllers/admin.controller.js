const { User, Package, Payment } = require("../models");
const { ID, formatDate } = require("../utils");

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
    FinalDeliveryDate: formatDate(new Date(req.body.finalDate)),
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
    FinalDeliveryDate: formatDate(new Date(req.body.finalDate)),
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
  const isRemoved = await User.delete(req.params.ssn);

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

const getPayments = async (req, res) => {
  const payments = await Payment.allConfirmedPayments();

  return res.render("admin/reports/payments", { payments });
};

const getPackagesBasedOnStatus = async (req, res) => {
  let packages = await Package.statusTracking({
    initialDate: formatDate(new Date(req.body.initialDate)),
    finalDate: formatDate(new Date(req.body.finalDate)),
  });

  const getWithPromiseAll = async () => {
    packages = await Promise.all(
      packages.map(async (package) => {
        // let statuses = await Package.getStatus(package.PackageNum);
        // if (statuses) {
        //   let status = statuses[0].pStatus;

        let pkg = await Package.get(package.PackageNum);

        return { ...pkg, status: package.pStatus, Date: package.pDate };
      })
    );
  };
  await getWithPromiseAll();
  packages = packages.filter((package) => package !== undefined);

  return res.render("admin/reports/status", { packages });
};

const getPackagesBasedOnTypes = async (req, res) => {
  let counts = await Package.typeTracking({
    initialDate: formatDate(new Date(req.body.initialDate)),
    finalDate: formatDate(new Date(req.body.finalDate)),
  });
  if (!counts) {
    counts = [
      {
        Type: "Reqular",
        Count: 0,
      },
      {
        Type: "Fragile",
        Count: 0,
      },
      {
        Type: "Liquid",
        Count: 0,
      },
      {
        Type: "Chemical",
        Count: 0,
      },
    ];
  }
  console.log(counts);
  return res.render("admin/reports/types", { counts });
};

const getPackagesBasedOnCustomer = async (req, res) => {
  let packages = await Package.SntRcvReport(req.body.customer_id);
  const getWithPromiseAll = async () => {
    packages = await Promise.all(
      packages.map(async (package) => {
        let statuses = await Package.getStatus(package.PackageNum);
        if (statuses) {
          let status = statuses[0].pStatus;
          return { ...package, status };
        }
      })
    );
  };
  await getWithPromiseAll();

  packages = packages.filter((package) => package !== undefined);

  return res.render("admin/reports/customerPackages", { packages });
};

const getTrackedPackages = async (req, res) => {
  const info = {
    Category: req.body.category,
    pStatus: req.body.status,
    city: req.body.city,
  };
  const packages = await Package.customTracking(info);

  return res.render("admin/reports/tracking", { packages });
};

const getPackages = async (req, res) => {
  let packages = await Package.getAll();
  let customers = await User.getAll();

  const getWithPromiseAll = async () => {
    packages = await Promise.all(
      packages.map(async (package) => {
        let statuses = await Package.getStatus(package.PackageNum);
        if (statuses) {
          let status = statuses[0].pStatus;
          return { ...package, status };
        }
      })
    );
  };
  await getWithPromiseAll();
  packages = packages.filter((package) => package !== undefined);
  customers = customers.filter(async (customer) => {
    let isAdmin = await User.isAdmin(customer.U_SSN);

    return !isAdmin;
  });

  return res.render("admin/packages", { customers, packages });
};

const getPackage = async (req, res) => {
  const packageBasic = await Package.get(req.params.num);

  const tracers = await Package.getPackageTracebackLocation(packageBasic);

  const package = { ...packageBasic, tracers };
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
