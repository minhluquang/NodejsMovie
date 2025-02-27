const { body, param, validationResult } = require("express-validator");
const {
  getTrendingMoviesServices,
  getUpcomingMoviesServices,
  getDetailMovieServices,
  getAllMovieImagesServices,
  getAllMovieVideosServices,
  getAllMovieCreditsServices,
} = require("../services/movie.services");

// Get movie trending (today/this week)
const getTrendingMovies = [
  param("type")
    .isIn(["today", "week"])
    .withMessage(
      "Invalid 'type' value. Accepted values are 'today' or 'week'."
    ),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        data: errors.array(),
      });
    }

    const { type } = req.params;
    try {
      const result = await getTrendingMoviesServices(type);
      res.status(result.code).send(result);
    } catch (error) {
      res.status(500).send({ success: false, data: { msg: error.message } });
    }
  },
];

// get movies upcoming
const getUpcomingMovies = async (req, res) => {
  try {
    const result = await getUpcomingMoviesServices();
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get detail movie
const getDetailMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getDetailMovieServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get all image of movie by movie_id
const getAllMovieImages = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllMovieImagesServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get all video of movie by movie_id
const getAllMovieVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllMovieVideosServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

// Get all credits
const getAllMovieCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllMovieCreditsServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getTrendingMovies,
  getUpcomingMovies,
  getDetailMovie,
  getAllMovieImages,
  getAllMovieVideos,
  getAllMovieCredits,
};
