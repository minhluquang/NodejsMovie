const {
  getPopularTVSeriesServices,
  getDetailTVSeriesServices,
  getAllTVSeriesImagesServices,
  getAllTVSeriesSeasonImagesServices,
  getAllTVSeriesSeasonEpisodeImagesServices,
  getAllTVSeriesVideosServices,
  getAllTVSeriesSeasonVideosServices,
  getAllTVSeriesSeasonEpisodeVideosServices,
} = require("../services/tvSeries.services");
const { body, param, validationResult } = require("express-validator");

// Get movie trending (today/this week)
const getPopularTVSeries = async (req, res) => {
  const { type } = req.params;
  try {
    const result = await getPopularTVSeriesServices(type);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getDetailTVSeries = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getDetailTVSeriesServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getAllTVSeriesImages = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getAllTVSeriesImagesServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getAllTVSeriesSeasonImages = async (req, res) => {
  const { id, season_number } = req.params;
  try {
    const result = await getAllTVSeriesSeasonImagesServices(id, season_number);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getAllTVSeriesSeasonEpisodeImages = async (req, res) => {
  const { id, season_number, episode_number } = req.params;
  try {
    const result = await getAllTVSeriesSeasonEpisodeImagesServices(
      id,
      season_number,
      episode_number
    );
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getAllTVSeriesVideos = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getAllTVSeriesVideosServices(id);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getAllTVSeriesSeasonVideos = async (req, res) => {
  const { id, season_number } = req.params;
  try {
    const result = await getAllTVSeriesSeasonVideosServices(id, season_number);
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

const getAllTVSeriesSeasonEpisodeVideos = async (req, res) => {
  const { id, season_number, episode_number } = req.params;
  try {
    const result = await getAllTVSeriesSeasonEpisodeVideosServices(
      id,
      season_number,
      episode_number
    );
    res.status(result.code).send(result);
  } catch (error) {
    res.status(500).send({ success: false, data: { msg: error.message } });
  }
};

module.exports = {
  getPopularTVSeries,
  getDetailTVSeries,
  getAllTVSeriesImages,
  getAllTVSeriesSeasonImages,
  getAllTVSeriesSeasonEpisodeImages,
  getAllTVSeriesVideos,
  getAllTVSeriesSeasonVideos,
  getAllTVSeriesSeasonEpisodeVideos,
};
