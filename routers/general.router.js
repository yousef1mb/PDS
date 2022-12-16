const express = require("express");
const router = express.Router();

const general = require("../controllers/general.controller");

router.get("/", general.getMainPage); // done
router.get("/login", general.getLoginPage); // done
router.post("/login", general.login); // done
router.get("/logout", general.logout); // done

module.exports = router;
