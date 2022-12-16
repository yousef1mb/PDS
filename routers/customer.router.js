const express = require("express");
const router = express.Router();

const customer = require("../controllers/customer.controller");

router.get("/:customer_id", customer.getCustomerPage); // done

// For packages
router.get("/:customer_id/packages", customer.getPackage); // consist of query // done
router.get("/:customer_id/packages/sent", customer.getSentPackages); // done
router.get("/:customer_id/packages/recieved", customer.getRecievedPackages); //done
router.post("/:customer_id/send", customer.send);
router.post("/:customer_id/recieve/:pkgnum", customer.recieve);

// For User
router.get("/:customer_id/update", customer.getUpdatePage); //done
router.post("/:customer_id/update", customer.updateInformation);

// For payment
router.get("/:customer_id/payment/:pkgnum", customer.getPaymentPage); // done
router.post("/:customer_id/payment/:pkgnum", customer.doPayment);

module.exports = router;
