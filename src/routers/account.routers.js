const express = require("express");
const { getAllAccounts } = require("../controllers/account.controllers");

const accountRouter = express.Router();

accountRouter.get("/", getAllAccounts);

module.exports = { accountRouter };
