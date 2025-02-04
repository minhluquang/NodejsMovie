const express = require("express");
const { getTrendingMedias } = require("../controllers/media.controllers");

const mediaRouter = express.Router();

mediaRouter.get("/trending/:type", getTrendingMedias);

module.exports = { mediaRouter };
