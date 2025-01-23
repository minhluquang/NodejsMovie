const express = require("express");
const {
  getAllAccounts,
  getAccount,
  createNewAccount,
  updateAccount,
  deleteAccount,
  verifyOTPEmailAddress,
  login,
  verifyEmailAddress,
  resetPassword,
} = require("../controllers/account.controllers");
const { authenticate } = require("../middleware/auth/authenticate");
const { authorize } = require("../middleware/auth/authorize");

const accountRouter = express.Router();

accountRouter.get("/", authenticate, authorize(["admin"]), getAllAccounts);
accountRouter.get("/:field/:value", getAccount);
accountRouter.post("/register", createNewAccount);
accountRouter.put("/", updateAccount);
accountRouter.delete("/:account_id", deleteAccount);
accountRouter.get("/verify-OTP-email-address", verifyOTPEmailAddress);
accountRouter.post("/login", login);
accountRouter.get("/verify-email-address", verifyEmailAddress);
accountRouter.put("/reset-password", resetPassword);

module.exports = { accountRouter };
