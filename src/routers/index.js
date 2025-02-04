const express = require("express");
const { accountRouter } = require("./account.routers");
const { movieRouter } = require("./movie.routers");
const { tvSeriesRouter } = require("./tvSeries.routers");
const { mediaRouter } = require("./media.routers");
const { peopleRouter } = require("./people.routers");
const rootRouter = express.Router();

rootRouter.use("/accounts", accountRouter);
rootRouter.use("/movie", movieRouter);
rootRouter.use("/tv", tvSeriesRouter);
rootRouter.use("/media", mediaRouter);
rootRouter.use("/people", peopleRouter);

module.exports = { rootRouter };
