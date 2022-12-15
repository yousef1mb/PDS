const express = require("express");
const router = express.Router();

const general = require("../controllers/general.controller");

router.get("/", general.getMainPage);
router.get("/login", general.getLoginPage);
router.post("/login", general.login);
router.post("/logout", general.logout);

export default router;
