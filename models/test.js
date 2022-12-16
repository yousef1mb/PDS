//Importing the package object
const { Package, Admin, User } = require("./dbObj");

//Giving values to our parameter
const pckg = {
  PackageNum: 123,
  Category: "'Fragile'",
  pValue: 5000,
  Width: 2,
  Height: 2,
  Length: 16,
  Weight: 59,
  Insurance_amount: 6,
  pStatus: "'Lost'",
  FinalDeliveryDate: null,
  Sender_SSN: 321,
  Reciever_SSN: 6969,
  RtlCenter_ID: 0,
};

//Checking whats gonna be given to the DB
console.log(`INSERT INTO Package(PackageNum, Category, pValue, 
  Width, Height, Length, Weight, Insurance_amount, pStatus, FinalDeliveryDate,
  Sender_SSN, Reciever_SSN, RtlCenter_ID)
  VALUES (${pckg.PackageNum},${pckg.Category},
  ${pckg.pValue},${pckg.Width},${pckg.Height},${pckg.Length},
  ${pckg.Weight},${pckg.Insurance_amount},${pckg.pStatus},${pckg.FinalDeliveryDate},
  ${pckg.Sender_SSN},${pckg.Reciever_SSN},${pckg.RtlCenter_ID})`);

//Checking if any errors appear
console.log(Package.addPackage(pckg));
