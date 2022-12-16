const getCustomerPage = async (req, res) => {
  const customer = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

  return res.render("customer/main", { customer });
};

const getSentPackages = async (req, res) => {
  let customers = [
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

  const customer = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

  const packages = [
    {
      packageNum: "453fdsa3242",
      status: "transit",
      category: "Fragile",
      value: 52335,
      insurance: "231",
    },
    {
      packageNum: "953gdja5f52",
      status: "delivered",
      category: "Fragile",
      value: 52335,
      insurance: "331",
    },
    {
      packageNum: "644g2dhyds5",
      status: "transit",
      category: "Regular",
      value: 52335,
      insurance: "31",
    },
  ];
  customers = customers.filter((item) => item.ssn != customer.ssn);

  return res.render("customer/sentPackages", { customer, customers, packages });
};

const getRecievedPackages = async (req, res) => {
  const customer = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

  const packages = [
    {
      packageNum: "453fdsa3242",
      status: "transit",
      category: "Fragile",
      value: 52335,
      insurance: "231",
    },
    {
      packageNum: "953gdja5f52",
      status: "delivered",
      category: "Fragile",
      value: 52335,
      insurance: "331",
    },
    {
      packageNum: "644g2dhyds5",
      status: "transit",
      category: "Regular",
      value: 52335,
      insurance: "31",
    },
  ];
  return res.render("customer/recievedPackages", { customer, packages });
};

const getPackage = async (req, res) => {
  const package = {
    packageNum: req.query.q,
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

  const customer = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

  return res.render("customer/package", { package, customer });
};

const send = async (req, res) => {};

const recieve = async (req, res) => {};

const getUpdatePage = async (req, res) => {
  const customer = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

  return res.render("customer/account", { customer });
};

const updateInformation = async (req, res) => {};

const getPaymentPage = async (req, res) => {
  const customer = {
    ssn: "3412452",
    fname: "Abdulaziz",
    mname: "Yaslam",
    phone: 537812391,
    lname: "Ban Agian",
    email: "abdulazizyass@gmail.com",
  };

  return res.render("customer/payment", { customer, amount: 82 });
};

const doPayment = async (req, res) => {};

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
