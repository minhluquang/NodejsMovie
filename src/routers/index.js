const express = require("express");
const { accountRouter } = require("./account.routers");
const rootRouter = express.Router();

rootRouter.use("/accounts", accountRouter);

module.exports = { rootRouter };
