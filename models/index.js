const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const Package = {
  //WORKS
  async create(pckg) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO Package(PackageNum, Category, pValue, 
       Width, Height, Length, Weight, Insurance_amount, FinalDeliveryDate,
       Sender_SSN, Reciever_SSN, RtlCenter_ID)
       VALUES (${pckg.PackageNum},'${pckg.Category}',
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
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `UPDATE Package SET
         Category = '${pckg.Category}', pValue = ${pckg.pValue}, 
         Width = ${pckg.Width}, Height = ${pckg.Height}, Length = ${pckg.Length},
         Weight = ${pckg.Weight}, Insurance_amount = ${pckg.Insurance_amount},
         FinalDeliveryDate = ${pckg.FinalDeliveryDate},
         RtlCenter_ID = ${pckg.RtlCenter_ID}
         WHERE PackageNum = ${pckg.PackageNum}`
    );

    await db.close();
    return true;
  },

  //WORKS
  async delete(pckg) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `DELETE FROM Package WHERE PackageNum = ${pckg.PackageNum}`
    );

    await db.close();
    return true;
  },

  //WORKS
  async get(PackageNum) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(
      `SELECT * FROM Package WHERE PackageNum = ${PackageNum}`
    );

    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  async getAll() {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM Package`);

    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  //get all sent packages by a specific user
  async getSent(U_SSN) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT * FROM Package WHERE Sender_SSN = ${U_SSN}`
    );

    await db.close();

    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  //get all recieved packages by a specific user
  async getRecieved(U_SSN) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT * FROM Package WHERE Reciever_SSN = ${U_SSN}`
    );

    await db.close();

    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  async getStatus(PackageNum) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT * FROM pckgStatus WHERE PackageNum = ${PackageNum}
      ORDER BY pDate DESC`
    );

    await db.close();

    if (metadata.length != 0) {
      return [metadata[0]];
    }
    return false;
  },

  //WORKS
  //This function lists all packages either sent or recieved by a certain user (Report)
  async SntRcvReport(U_SSN) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM Package
    WHERE Sender_SSN = ${U_SSN} OR Reciever_SSN = ${U_SSN}`);

    await db.close();

    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //NOT TESTED
  //(Report)
  async getPackageTraceback(pckg) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
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
        if (tableName[i] == "Warehouse" || "Airport") {
          return currentState.City;
        } else {
          return currentState;
        }
      }
    }
    await db.close();
    return false;
  },

  //NOT TESTED
  //(Report)
  //List all packages based on (category, city, status)
  async customTracking(info) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
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

  //WORKS
  //(Report)
  // N packages of a certain type between 2 dates
  async typeTracking(dates) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT Category as Type, COUNT(*) as Count
      FROM Package
      WHERE PackageNum IN
      (SELECT PackageNum FROM pckgStatus
      WHERE pDate BETWEEN '${dates.initialDate}' AND '${dates.finalDate}')
      GROUP BY Category`
    );
    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  //(Report)
  //List all lost/delayed/delivered packages between two dates
  async statusTracking(dates) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT * FROM pckgStatus
      WHERE pStatus IN ('Lost', 'Delayed', 'Delivered')
      AND pDate BETWEEN '${dates.initialDate}' AND '${dates.finalDate}'
      ORDER BY PackageNum ASC, pDate DESC`
    );
    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },
};

//ALL OF PAYMENT FUNCTIONS TESTED AND WORK
const Payment = {
  //WORKS
  //Adds amount of payment to the db to considered confirmed payment later
  async add(Payment) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.run(
      `INSERT INTO Payment(Usr_SSN, PackageNum, Amount)
      VALUES (${Payment.Usr_SSN}, ${Payment.PackageNum}, ${Payment.Amount})`
    );
    await db.close();
    return true;
  },

  //WORKS
  //All confirmed payments report (Report)
  async allConfirmedPayments() {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });
    const metadata = await db.all(
      `SELECT *
        FROM Payment`
    );
    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },
};

//ALL OF USER FUNCTIONS TESTED AND WORK
const User = {
  //WORKS
  //Add user to DB
  async create(user) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO sysUser(U_SSN, Fname, Mname, Lname, Phone, Email, Password)
           VALUES (${user.U_SSN}, '${user.Fname}',
           '${user.Mname}','${user.Lname}','${user.Phone}','${user.Email}',
           '${user.Password}')`
    );

    await db.close();
    return true;
  },

  //WORKS
  //Check if a certain user is an admin or not
  async isAdmin(U_SSN) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
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

  //WORKS
  //Remove certain user from DB by ID
  async delete(U_SSN) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(`DELETE FROM sysUSer WHERE U_SSN = ${U_SSN}`);

    await db.close();
    return true;
  },

  //WORKS
  //Edit certain user info by ID
  async update(user) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `UPDATE sysUser SET
        U_SSN = ${user.U_SSN}, Fname = '${user.Fname}', 
        Mname = '${user.Mname}', Lname = '${user.Lname}', Phone = '${user.Phone}',
        Email = '${user.Email}', Password = '${user.Password}'`
    );

    await db.close();
    return true;
  },

  //WORKS
  async getAll() {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM sysUser`);

    await db.close();
    if (metadata.length != 0) {
      return metadata;
    }
    return false;
  },

  //WORKS
  async getBySSN(U_SSN) {
    const db = await sqlite.open({
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(
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
      filename: "../pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(
      `SELECT * FROM sysUser WHERE Email = '${Email}'`
    );

    await db.close();
    if (metadata.length != 0) {
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
