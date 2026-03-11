const express = require("express");
const { createGroup } = require("../controllers/group.controller");
const router = express.Router();

router.post("/group", createGroup);

module.exports = router;
