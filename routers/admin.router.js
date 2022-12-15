const express = require("express");
const router = express.Router();

const admin = require("../controllers/admin.controller");

router.get("/", admin.getAdminPage);

// For reports
router.get("/reports", admin.getReportsPage);
router.post("/reports/payments", admin.getPayments);
router.post("/reports/packages/status", admin.getPackagesBasedOnStatus);
router.post("/reports/packages/types", admin.getPackagesBasedOnTypes);
router.post("/reports/packages/tracking", admin.getTrackedPackages);
router.post(
  "/reports/packages/:customer_ssn",
  admin.getPackagesBasedOnCustomer
);

// For packages
router.post("/packages/create", admin.addPackage);
router.post("/packages/:num/update", admin.editPackage);
router.post("/packages/:num/delete", admin.removePackage);

// For users
router.post("/users/create", admin.addUser);
router.post("/users/:ssn/update", admin.editUser);
router.post("/users/:ssn/delete", admin.removeUser);

export default router;
