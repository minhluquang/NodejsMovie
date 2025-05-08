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
  getMediaByKeyword,
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
  "/interaction-status/:type/:id/",
  authenticate,
  getMediaInteractionStatusByAccountId
);
mediaRouter.delete("/favorite", authenticate, deleteFavorite);
mediaRouter.delete("/watchlist", authenticate, deleteWatchlist);
mediaRouter.get("/search", authenticate, getMediaByKeyword);

module.exports = { mediaRouter };
