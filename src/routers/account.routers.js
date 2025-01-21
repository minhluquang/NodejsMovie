const express = require("express");
const {
  getAllAccounts,
  getAccount,
  createNewAccount,
  updateAccount,
  deleteAccount,
  verifyEmailAddress,
  login,
} = require("../controllers/account.controllers");
const { authenticate } = require("../middleware/auth/authenticate");
const { authorize } = require("../middleware/auth/authorize");

const accountRouter = express.Router();

accountRouter.get("/", authenticate, authorize(["admin"]), getAllAccounts);
accountRouter.get("/:field/:value", getAccount);
accountRouter.post("/register", createNewAccount);
accountRouter.put("/", updateAccount);
accountRouter.delete("/:account_id", deleteAccount);
accountRouter.get("/verify-email-address", verifyEmailAddress);
accountRouter.post("/login", login);

module.exports = { accountRouter };
