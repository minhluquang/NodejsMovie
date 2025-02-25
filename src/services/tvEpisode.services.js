const { Op } = require("sequelize");
const {
  tvSeries,
  tvSeason,
  tvEpisode,
  tvEpisodePeople,
  People,
} = require("../models");

const getDetailEpisodeServices = async (
  tv_series_id,
  season_number,
  episode_number
) => {
  try {
    const episode = await tvSeries.findOne({
      where: { tv_series_id },
      include: [
        {
          model: tvSeason,
          where: { season_number },
          include: [
            {
              model: tvEpisode,
              as: "episodes",
              attributes: {
                exclude: ["createdAt", "updatedAt", "tv_season_id"],
              },
              where: { episode_number },
            },
          ],
        },
      ],
    });

    if (!episode?.tvSeasons?.[0]?.episodes?.length) {
      return {
        success: true,
        code: 200,
        data: { msg: "No tv episode found." },
      };
    }

    const episodeData = episode.tvSeasons[0].episodes[0].get({ plain: true });

    return {
      success: true,
      code: 200,
      data: {
        ...episodeData,
        season_number: episode.tvSeasons[0].season_number,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { getDetailEpisodeServices };
