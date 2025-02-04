const express = require("express");
const { accountRouter } = require("./account.routers");
const { movieRouter } = require("./movie.routers");
const { tvSeriesRouter } = require("./tvSeries.routers");
const { mediaRouter } = require("./media.routers");
const rootRouter = express.Router();

rootRouter.use("/accounts", accountRouter);
rootRouter.use("/movie", movieRouter);
rootRouter.use("/tv", tvSeriesRouter);
rootRouter.use("/media", mediaRouter);

module.exports = { rootRouter };
