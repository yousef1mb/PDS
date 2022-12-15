const express = require("express");
const router = express.Router();

const customer = require("../controllers/customer.controller");

router.get("/:customer_id", customer.getCustomerPage);

// For packages
router.get("/:customer_id/packages/sent", customer.getSentPackages);
router.get("/:customer_id/packages/recieved", customer.getRecievedPackages);
router.get("/:customer_id/packages/:num", customer.getPackage);
router.post("/:customer_id/send", customer.send);
router.post("/:customer_id/recieve", customer.recieve);

// For User
router.get("/:customer_id/update", customer.getUpdatePage);
router.post("/:customer_id/update", customer.updateInformation);

// For payment
router.get("/:customer_id/payment", customer.getPaymentPage);
router.post("/:customer_id/payment", customer.doPayment);

export default router;
