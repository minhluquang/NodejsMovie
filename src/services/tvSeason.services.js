const { Op } = require("sequelize");
const { tvSeries, tvSeason, tvEpisode } = require("../models");

const getLastAirEpisode = async (tv_series_id) => {
  try {
    const lastAirEpisode = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.lte]: new Date() } },
      include: {
        model: tvEpisode,
        where: { air_date: { [Op.lte]: new Date() } },
      },
      order: [
        ["air_date", "desc"],
        [tvEpisode, "episode_number", "desc"],
      ],
      limit: 1,
    });

    return lastAirEpisode?.tvEpisodes[0] || null;
  } catch (error) {
    throw error;
  }
};

const getNextAirEpisode = async (tv_series_id) => {
  try {
    const nextAirEpisode = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.gte]: new Date() } },
      include: {
        model: tvEpisode,
        where: { air_date: { [Op.gte]: new Date() } },
      },
      order: [
        ["air_date", "asc"],
        [tvEpisode, "episode_number", "asc"],
      ],
      limit: 1,
    });

    return nextAirEpisode?.tvEpisodes[0] || null;
  } catch (error) {
    throw error;
  }
};

const getLastAirSeason = async (tv_series_id) => {
  try {
    const nextAirSeason = await tvSeason.findOne({
      where: { tv_series_id, air_date: { [Op.gte]: new Date() } },
      include: {
        model: tvEpisode,
        where: { air_date: { [Op.gte]: new Date() } },
      },
      order: [["air_date", "asc"]],
      limit: 1,
    });

    return nextAirSeason || null;
  } catch (error) {
    throw error;
  }
};

module.exports = { getLastAirEpisode, getNextAirEpisode, getLastAirSeason };
