const _ = require("lodash");

const { Op, where, Sequelize } = require("sequelize");
const { tvSeries, tvSeason, tvEpisode } = require("../models");
const { getLastAirEpisode, getNextAirEpisode } = require("./tvSeason.services");

const getPopularTVSeriesServices = async () => {
  try {
    const popularTVSeries = await tvSeries.findAll({
      order: [
        ["popularity", "desc"],
        ["vote_count", "desc"],
        ["vote_average", "desc"],
      ],
      limit: 20,
    });

    // Return if have no movie
    if (!popularTVSeries || popularTVSeries.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No tv series found" },
      };
    }

    for (const series of popularTVSeries) {
      const tv_series_id = series.tv_series_id;
      const lastEpisodeToAir = await getLastAirEpisode(tv_series_id);
      const nextEpisodeToAir = await getNextAirEpisode(tv_series_id);

      const seriesObject = series.get({ plain: true });

      seriesObject.last_episode_to_air =
        lastEpisodeToAir?.tv_episode_id || null;
      seriesObject.next_episode_to_air =
        nextEpisodeToAir?.tv_episode_id || null;

      seriesObject.last_air_date = lastEpisodeToAir?.air_date || null;
    }

    // Return if have movie
    return {
      success: true,
      code: 200,
      data: popularTVSeries,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getPopularTVSeriesServices };
