const express = require("express");
const {
  getAllAccounts,
  getAccount,
  createNewAccount,
  updateAccount,
  deleteAccount,
  verifyEmailAddress,
} = require("../controllers/account.controllers");

const accountRouter = express.Router();

accountRouter.get("/", getAllAccounts);
accountRouter.get("/:field/:value", getAccount);
accountRouter.post("/", createNewAccount);
accountRouter.put("/", updateAccount);
accountRouter.delete("/:account_id", deleteAccount);
accountRouter.get("/verify-email-address", verifyEmailAddress);

module.exports = { accountRouter };
