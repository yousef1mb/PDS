const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const Package = {
  //WORKS
  async create(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO Package(PackageNum, Category, pValue, 
       Width, Height, Length, Weight, Insurance_amount, FinalDeliveryDate,
       Sender_SSN, Reciever_SSN, RtlCenter_ID)
       VALUES ('${pckg.PackageNum}','${pckg.Category}',
       ${pckg.pValue},${pckg.Width},${pckg.Height},${pckg.Length},
       ${pckg.Weight},${pckg.Insurance_amount},${pckg.FinalDeliveryDate},
       ${pckg.Sender_SSN},${pckg.Reciever_SSN},${pckg.RtlCenter_ID})`
    );

    await db.close();
    return true;
  },

  //WORKS
  async update(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `UPDATE Package SET
         Category = '${pckg.Category}', pValue = ${pckg.pValue}, 
         Width = ${pckg.Width}, Height = ${pckg.Height}, Length = ${pckg.Length},
         Weight = ${pckg.Weight}, Insurance_amount = ${pckg.Insurance_amount},
         FinalDeliveryDate = ${pckg.FinalDeliveryDate}, 
         RtlCenter_ID = ${pckg.RtlCenter_ID}
         WHERE PackageNum = '${pckg.PackageNum}'`
    );

    await db.close();
    return true;
  },

  //WORKS
  async delete(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `DELETE FROM Package WHERE PackageNum = '${pckg.PackageNum}'`
    );

    await db.close();
    return true;
  },

  //WORKS
  async get(PackageNum) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.get(
      `SELECT * FROM Package WHERE PackageNum = '${PackageNum}'`
    );

    await db.close();
    if (metadata) {
      return metadata;
    }
    return false;
  },

  //WORKS
  async getAll() {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM Package`);

    await db.close();
    return metadata;
  },
  async getPackageTraceback(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT  History_of_Locations.SurrogateLocation, History_of_Locations.Date
      from Package, History_of_Locations
      where History_of_Locations.PackageNum = ${pckg.PackageNum} 
      ORDER BY History_of_Locations.Date DESC;`
    );
    const srglocation = metadata[0].SurrogateLocation;
    const tableName = ["Truck", "Warehouse", "Plane", "Airport"];
    var currentState;
    for (let i = 0; i++; i < tableName.length) {
      currentState = db.all(`
      SELECT *
      FROM ${tableName[i]}
      WHERE ${srglocation} = Truck.SurrogateLocation
      `);
      if (currentState != null) {
        await db.close();
        if (tableName[i] == "Warehouse" || tableName[i] == "Airport") {
          return currentState.City;
        } else {
          return currentState;
        }
      }
    }
    await db.close();
    return false;
  },
  //get all sent packages by a specific user
  async getSentPckgs(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT * FROM Package WHERE Sender_SSN = ${U_SSN}`
    );
    await db.close();
    return metadata;
  },
  //get all recieved packages by a specific user
  async getRecievedPckgs(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT * FROM Package WHERE Reciever_SSN = ${U_SSN}`
    );
    await db.close();
    return metadata;
  },

  //This function lists all packages either sent or recieved by a certain user (Report)
  async SntRcvReport(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM Packages
    WHERE Sender_SSN = ${U_SSN} OR Reciever_SSN = ${U_SSN}`);

    await db.close();
    return metadata;
  },

  // (Report)
  async customTracking(info) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT Package.PackageNum FROM Package
    WHERE Category = ${info.Category} AND pStatus = ${info.pStatus}`);
    var founds = [];
    for (let i = 0; i++; i < metadata.length) {
      if (User.tracePackage(metadata[i]) == info.City) {
        founds.push(metadata[i]);
      }
    }
    await db.close();
    // you might return founds.length for counting the total number
    return founds;
  },

  //List all packages between a certain date based on package status  (Report)
  async packagesStatus(dates) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT Package.Category, COUNT(*)
      FROM sysUser, History_of_location
      WHERE Package.PackageNum = History_of_location.PackageNum AND
      History_of_location.date BETWEEN ${dates.initialDate} AND ${dates.finalDate}
      GROUP BY Package.Category`
    );
    await db.close();
    return metadata;
  },

  //  List all lost/delayed/delivered packages between two dates (Report)
  async packagesTravelingStatus(dates) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT Package.pStatus, COUNT(*)
      FROM Package, History_of_location
      WHERE Package.PackageNum = History_of_location.PackageNum AND
      History_of_location.date BETWEEN ${dates.initialDate} AND ${dates.finalDate}
      GROUP BY Package.pStatus`
    );
    await db.close();
    return metadata;
  },
};

const Payment = {
  //Adds amount of payment to the db to considered confirmed payment later
  async add(payment) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.run(
      `INSERT INTO Payment(Usr_SSN, PackageNum, Amount)
      VALUES (${payment.Usr_SSN}, '${payment.PackageNum}', ${payment.Amount})`
    );
    await db.close();
    return true;
  },

  //All confirmed payments report (Report)
  async allConfirmedPayments() {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT *
        FROM Payment`
    );
    await db.close();
    return metadata;
  },
};

const User = {
  //Add user to DB
  async create(user) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO sysUser(U_SSN, Fname, Mname, Lname, Phone, Email, Password)
           VALUES (${user.U_SSN}, '${user.Fname}',
          '${user.Mname}','${user.Lname}',${user.Phone},'${user.Email}',
           ${user.Password})`
    );

    await db.close();
    return true;
  },
  async setCustomer(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO Customer(U_SSN)
           VALUES (${U_SSN})`
    );

    await db.close();
    return true;
  },
  async setAdmin(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO Admin(U_SSN)
           VALUES (${U_SSN})`
    );

    await db.close();
    return true;
  },
  //Check if a certain user is an admin or not
  async isAdmin(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const isAdmin = await db.all(
      `SELECT COUNT(1)
      FROM Admin
      WHERE U_SSN = ${U_SSN}`
    );

    await db.close();
    return isAdmin[0]["COUNT(1)"] == true;
  },
  //Remove certain user from DB by ID
  async delete(user) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const usr = await db.run(`DELETE FROM sysUSer WHERE U_SSN = ${user.U_SSN}`);
    const customer = await db.run(
      `DELETE FROM Customer WHERE U_SSN = ${user.U_SSN}`
    );
    const admin = await db.run(`DELETE FROM Admin WHERE U_SSN = ${user.U_SSN}`);

    await db.close();
    return true;
  },

  //Edit certain user info by ID
  async update(user) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `UPDATE sysUser SET
        Fname = '${user.Fname}', 
        Mname = '${user.Mname}', Lname = '${user.Lname}', Phone = ${user.Phone},
        Email = '${user.Email}', Password = ${user.Password} WHERE U_SSN = ${user.U_SSN}`
    );

    await db.close();
    return true;
  },

  async getAll() {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM sysUser`);

    await db.close();
    return metadata;
  },

  //WORKS
  async getBySSN(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.get(
      `SELECT * FROM sysUser WHERE U_SSN = ${U_SSN}`
    );

    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  async getByEmail(Email) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.get(
      `SELECT * FROM sysUser WHERE Email = '${Email}'`
    );

    await db.close();
    if (metadata) {
      return metadata;
    }
    return false;
  },
};
module.exports = {
  Package,
  Payment,
  User,
};
