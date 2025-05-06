const express = require("express");
const {
  getTrendingMedias,
  getAllMovieMultiMedia,
  getAllTVSeriesMultiMedia,
  getVideoTrailers,
  addWatchlist,
  addFavorite,
  addRating,
  updateRating,
  deleteRating,
  getMediaInteractionStatusByAccountId,
  deleteFavorite,
  deleteWatchlist,
} = require("../controllers/media.controllers");
const { authenticate } = require("../middleware/auth/authenticate");

const mediaRouter = express.Router();

mediaRouter.get("/trending/:type", getTrendingMedias);
mediaRouter.get("/movie/:id/multimedia", getAllMovieMultiMedia);
mediaRouter.get("/tv/:id/multimedia", getAllTVSeriesMultiMedia);
mediaRouter.get("/video-trailers", getVideoTrailers);
mediaRouter.post("/watchlist", authenticate, addWatchlist);
mediaRouter.post("/favorite", authenticate, addFavorite);
mediaRouter.post("/rating", authenticate, addRating);
mediaRouter.put("/rating", authenticate, updateRating);
mediaRouter.delete("/rating", authenticate, deleteRating);
mediaRouter.get(
  "/rating/:type/:id/",
  authenticate,
  getMediaInteractionStatusByAccountId
);
mediaRouter.delete("/favorite", authenticate, deleteFavorite);
mediaRouter.delete("/watchlist", authenticate, deleteWatchlist);

module.exports = { mediaRouter };
