const { render } = require("ejs");

const getAdminPage = async (req, res) => {
  const admin = {
    fname: "Admin",
  };
  res.render("admin/main", { admin });
};

const getReportsPage = async (req, res) => {
  const customers = [
    {
      ssn: "3412452",
      fname: "Abdulaziz",
      lname: "Ban Agian",
    },
    {
      ssn: "74154352",
      fname: "Yousef",
      lname: "Bukhari",
    },
    {
      ssn: "25435252",
      fname: "Rayyan",
      lname: "Redha",
    },
  ];
  return res.render("admin/reports", { customers });
};

const addPackage = async (req, res) => {};

const removePackage = async (req, res) => {};

const editPackage = async (req, res) => {};

const addUser = async (req, res) => {};

const removeUser = async (req, res) => {};

const editUser = async (req, res) => {};

const getPayments = async (req, res) => {};

const getPackagesBasedOnStatus = async (req, res) => {};

const getPackagesBasedOnTypes = async (req, res) => {};

const getPackagesBasedOnCustomer = async (req, res) => {};

const getTrackedPackages = async (req, res) => {};

const getPackages = async (req, res) => {
  const packages = [
    {
      packageNum: "453fdsa3242",
      status: "transit",
      category: "Fragile",
      insurance: "231",
    },
    {
      packageNum: "953gdja5f52",
      status: "delivered",
      category: "Fragile",
      insurance: "331",
    },
    {
      packageNum: "644g2dhyds5",
      status: "transit",
      category: "Regular",
      insurance: "31",
    },
  ];

  const customers = [
    {
      ssn: "3412452",
      fname: "Abdulaziz",
      lname: "Ban Agian",
    },
    {
      ssn: "74154352",
      fname: "Yousef",
      lname: "Bukhari",
    },
    {
      ssn: "25435252",
      fname: "Rayyan",
      lname: "Redha",
    },
  ];

  return res.render("admin/packages", { customers, packages });
};

const getPackage = async (req, res) => {
  const package = {
    packageNum: req.params.num,
    weight: "12",
    category: "Fragile",
    insurance: "231",
    value: "1231",
    width: 12,
    height: 20,
    length: 100,
    barcode: 5324985789310,
    tracers: [
      {
        date: new Date().toDateString(),
        location: "Dammam",
        status: "transit",
      },
      {
        date: new Date().toDateString(),
        location: "Riyadh",
        status: "transit",
      },
      {
        date: new Date().toDateString(),
        location: "Jeddah",
        status: "deliverd",
      },
    ],
  };

  return res.render("admin/package", { package });
};

const getUsers = async (req, res) => {
  const users = [
    {
      ssn: "3412452",
      fname: "Abdulaziz",
      phone: 537812391,
      lname: "Ban Agian",
      role: "Admin",
    },

    {
      ssn: "74154352",
      fname: "Yousef",
      phone: 557712273,
      lname: "Bukhari",
      role: "Customer",
    },

    {
      ssn: "25435252",
      fname: "Rayyan",
      phone: 533426322,
      lname: "Redha",
      role: "Customer",
    },
  ];

  return res.render("admin/users", { users });
};

const getUser = async (req, res) => {
  const user = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

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
