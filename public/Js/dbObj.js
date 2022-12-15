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

  //NOT COMPLETED
  //Generates a report about a packages depending on (categories, locations and status)
  async customTracking(info) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.Database,
    });

    const metadata = await db.all(`SELECT * FROM Packages
    WHERE Category = ${info.Category} AND Status = ${info.Status} AND`);

    await db.close();
    return metadata;
  },

  //NOT COMPLETED
  //List all packages between a certain date based on package status
  async packagesStatus(dates) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
    });
    const metadata = await db.all(
      `select Package.PackageNum, Package.Status, 
      FROM sysUser, History_of_location
      WHERE Package.PackageNum = History_of_location.PackageNum AND
      History_of_location.date between ${dates.initialDate} AND ${dates.finalDate}`
    );
    await db.close();
    return metadata;
  },

  /* ================END OF REPORTS================*/
};

const User = {
  //NOT SURE THIS IS WORKING <ALERT>
  //ASK RAYAN :D
  async tracePackage(pckg) {
    const db = await sqlite.open({
      filename: "pckg_dlv.db",
      driver: sqlite3.database,
    });
    const metadata = await db.all(
      `select  *
      from Package, History_of_Locations, Airport, Plane, Warehouse, Truck, Transport_via
      where ${pckg.PackageNum} = History_of_Locations.PackageNum
      and (
        History_of_Locations.Lsurrogate = Airport.Lsurrogate
        or
        History_of_Locations.Lsurrogate = plane.Lsurrogate
        or 
        History_of_Locations.Lsurrogate = Truck.Lsurrogate
        or
        History_of_Locations.Lsurrogate = Transport_via.PackageNum
        
      )`
    );
    await db.close();
    return metadata;
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

  //This adds package info either sent or recieved
  async SendRecievePackage(pckg) {
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
};
module.exports = {
  Package,
  Admin,
  User,
};
