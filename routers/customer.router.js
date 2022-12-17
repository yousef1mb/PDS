const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const customer = require("../controllers/customer.controller");

router.get("/:customer_id", auth.userAuth, customer.getCustomerPage); // done

// For packages
router.get("/:customer_id/packages", auth.userAuth, customer.getPackage); // consist of query // done
router.get(
  "/:customer_id/packages/sent",
  auth.userAuth,
  customer.getSentPackages
); // done
router.get(
  "/:customer_id/packages/recieved",
  auth.userAuth,
  customer.getRecievedPackages
); //done
router.post("/:customer_id/send", auth.userAuth, customer.send);
router.post("/:customer_id/recieve/:pkgnum", auth.userAuth, customer.recieve);

// For User
router.get("/:customer_id/update", auth.userAuth, customer.getUpdatePage); //done
router.post("/:customer_id/update", auth.userAuth, customer.updateInformation);

// For payment
router.get(
  "/:customer_id/payment/:pkgnum",
  auth.userAuth,
  customer.getPaymentPage
); // done
router.post("/:customer_id/payment/:pkgnum", auth.userAuth, customer.doPayment);

module.exports = router;
