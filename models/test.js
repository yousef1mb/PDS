//Importing the package object
const { Package, Admin, User } = require("./dbObj");

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

//Checking whats gonna be given to the DB
// console.log(`INSERT INTO Package(PackageNum, Category, pValue,
//   Width, Height, Length, Weight, Insurance_amount, FinalDeliveryDate,
//   Sender_SSN, Reciever_SSN, RtlCenter_ID)
//   VALUES (${pckg.PackageNum},${pckg.Category},
//   ${pckg.pValue},${pckg.Width},${pckg.Height},${pckg.Length},
//   ${pckg.Weight},${pckg.Insurance_amount}s,${pckg.FinalDeliveryDate},
//   ${pckg.Sender_SSN},${pckg.Reciever_SSN},${pckg.RtlCenter_ID})`);

//Put ur testing code here
(async () => {
  //console.log(await Package.create(pckg));
  console.log(await Package.get(696));
})();
