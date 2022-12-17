//Importing the package object
const { Package, Admin, User, Payment } = require(".");

//Giving values to our parameter
const pckg = {
  PackageNum: 321,
  Category: "'Lost'",
  pValue: 5000,
  Width: 2,
  Height: 2,
  Length: 16,
  Weight: 59,
  Insurance_amount: 6,
  FinalDeliveryDate: null,
  Sender_SSN: 321,
  Reciever_SSN: 6969,
  RtlCenter_ID: 0,
};

const payment = {
  Usr_SSN: 333,
  PackageNum: 789,
  Amount: 40,
};

const user = {
  U_SSN: 321,
  Fname: "'Yousef'",
  Mname: "'Mo'",
  Lname: "'Bokhary'",
  Phone: "'0508416337'",
  Email: "'y@b.com'",
  Password: "'DummyPass'",
};

const user2 = {
  U_SSN: 693,
  Fname: "'Rayyan'",
  Mname: "'A'",
  Lname: "'Redha'",
  Phone: "'05XXXXXXX'",
  Email: "'R@R.com'",
  Password: "'DummyPass'",
};

const dates = {
  initialDate: "2022/05/22",
  finalDate: "2022/05/27",
};

const info = {
  Category:"Liquid",
  pStatus:"Delivered",
  city: "riyadh"
};
//Checking whats gonna be given to the DB
// console.log(`SELECT Category, COUNT(*)
// FROM Package
// WHERE PackageNum IN
// (SELECT PackageNum FROM pckgStatus
// WHERE pDate BETWEEN ${dates.initialDate} AND ${dates.finalDate})
// GROUP BY Category`);

//Put ur testing code here
(async () => {
  //console.log(await Package.create(pckg));
  console.log(await Package.customTracking(info));
})();
