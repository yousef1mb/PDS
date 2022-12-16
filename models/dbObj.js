const Package = {
  async addPackage(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO Package(PackageNum, Category, pValue, 
       Width, Height, Length, Weight, Insurance_amount, Status, FinalDeliveryDate,
       Sender_SSN, Reciever_SSN, RtlCenter_ID)
       VALUES (${pckg.PackageNum},${pckg.Category},
       ${pckg.pValue},${pckg.Width},${pckg.Height},${pckg.Length},
       ${pckg.Weight},${pckg.Insurance_amount},${pckg.Status},${pckg.FinalDeliveryDate},
       ${pckg.Sender_SSN},${pckg.Reciever_SSN},${pckg.RtlCenter_ID})`
    );

    await db.close();
    return true;
  },

  async removePackage(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `DELETE FROM Package WHERE PackageNum = ${pckg.PackageNum}`
    );

    await db.close();
    return true;
  },

  async editPackage(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `UPDATE Package SET
         Category = ${pckg.Category}, pValue = ${pckg.pValue}, 
         Width = ${pckg.Width}, Height = ${pckg.Height}, Length = ${pckg.Length},
         Weight = ${pckg.Weight}, Insurance_amount = ${pckg.Insurance_amount},
         Status = ${pckg.Status}, FinalDeliveryDate = ${pckg.FinalDeliveryDate},
         Sender_SSN = ${pckg.Sender_SSN}, Reciever_SSN = ${pckg.Reciever_SSN}, 
         RtlCenter_ID ${pckg.RtlCenter_ID}
         WHERE PackageNum = ${pckg.PackageNum}`
    );

    await db.close();
    return true;
  },
};

const Admin = {
  //Add user to DB
  async addUser(user) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `INSERT INTO sysUser(U_SSN, Fname, Mname, Lname, Phone, Email, Password)
           VALUES (${user.U_SSN}, ${user.Fname},
           ${user.Mname},${user.Lname},${user.Phone},${user.Email},
           ${user.Password})`
    );

    await db.close();
    return true;
  },

  //Remove certain user from DB by ID
  async removeUser(user) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `DELETE FROM sysUSer WHERE U_SSN = ${user.U_SSN}`
    );

    await db.close();
    return true;
  },

  //Edit certain user info by ID
  async editUser(user) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.run(
      `UPDATE sysUser SET
        U_SSN = ${user.U_SSN}, Fname = ${user.Fname}, 
        Mname = ${user.Mname}, Lname = ${user.Lname}, Phone = ${user.Phone},
        Email = ${user.Email}, Password = ${user.Password}`
    );

    await db.close();
    return true;
  },

  //get All the users on the site
  async getAllUsers() {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM sysUser`);

    await db.close();
    return metadata;
  },

  //get All the packages on the site
  async getAllPackages() {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM Package`);

    await db.close();
    return metadata;
  },

  /* ===================REPORTS===================*/

  //All confirmed payments report
  async allConfirmedPayments() {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
    });
    const metadata = await db.all(
      `SELECT *
        FROM Payment`
    );
    await db.close();
    return metadata;
  },

  //This function lists all packages either sent or recieved by a certain user
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

  async customTracking(info) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT Package.PackageNum FROM Package
    WHERE Category = ${info.Category} AND Status = ${info.Status}`);
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

  //List all packages between a certain date based on package status
  async packagesStatus(dates) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
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

  /* ================END OF REPORTS================*/
  //  List all lost/delayed/delivered packages between two dates

  async packagesTravelingStatus(dates) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
    });
    const metadata = await db.all(
      `SELECT Package.Status, COUNT(*)
      FROM Package, History_of_location
      WHERE Package.PackageNum = History_of_location.PackageNum AND
      History_of_location.date BETWEEN ${dates.initialDate} AND ${dates.finalDate}
      GROUP BY Package.Status`
    );
    await db.close();
    return metadata;
  },
};

const User = {
  async tracePackage(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
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

  //Adds amount of payment to the db to considered confirmed payment later
  async addPayment(usr) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
    });
    const metadata = await db.run(
      `INSERT INTO Payment(Usr_SSN, PackageNum, Amount)
      VALUES (${usr.Usr_SSN}, ${usr.PackageNum}, ${usr.Amount})`
    );
    await db.close();
    return true;
  },

  //This adds sent package info
  async SendPackage(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
    });
    const metadata = await db.run(
      `INSERT INTO Package(PackageNum, Category, pValue, 
         Width, Height, Length, Weight, Insurance_amount, Status, FinalDeliveryDate,
         Sender_SSN, Reciever_SSN, RtlCenter_ID)
         VALUES (${pckg.PackageNum},${pckg.Category},
         ${pckg.pValue},${pckg.Width},${pckg.Height},${pckg.Length},
         ${pckg.Weight},${pckg.Insurance_amount},${pckg.Status},${pckg.FinalDeliveryDate},
         ${Sender_SSN},${Reciever_SSN},${pckg.RtlCenter_ID})`
    );
    await db.close();
    return true;
  },

  //get all sent packages by a specific user
  async getSentPckgs(U_SSN) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
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
      driver: sqlite3.database,
    });
    const metadata = await db.all(
      `SELECT * FROM Package WHERE Reciever_SSN = ${U_SSN}`
    );
    await db.close();
    return metadata;
  },
};
module.exports = {
  Package,
  Admin,
  User,
};
