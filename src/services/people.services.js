const {
  People,
  tvSeasonPeople,
  tvEpisodePeople,
  tvEpisode,
  tvSeason,
  tvSeries,
  MoviePeople,
  Movie,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

// Get all account
const getTopTenPeopleServices = async (number) => {
  try {
    const limit = parseInt(number, 10);
    const topPeople = await People.findAll({
      include: [
        {
          model: tvEpisodePeople,
          include: {
            model: tvEpisode,
            include: {
              model: tvSeason,
              include: {
                model: tvSeries,
              },
            },
          },
          attributes: [],
        },

        { model: MoviePeople, include: { model: Movie }, attributes: [] },
      ],
      order: [["popularity", "desc"]],
      limit: limit,
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT COUNT(DISTINCT tv_series.tv_series_id) FROM tv_series " +
                "INNER JOIN tv_seasons ON tv_seasons.tv_series_id = tv_series.tv_series_id " +
                "INNER JOIN tv_episodes ON tv_episodes.tv_season_id = tv_seasons.tv_season_id " +
                "INNER JOIN tv_episode_people ON tv_episode_people.tv_episode_id = tv_episodes.tv_episode_id " +
                "WHERE tv_episode_people.person_id = People.person_id)"
            ),
            "tv_series_count",
          ],
          [
            sequelize.literal(
              "(SELECT COUNT(DISTINCT movies.movie_id) FROM movie_people " +
                "INNER JOIN movies ON movies.movie_id = movie_people.movie_id " +
                "WHERE movie_people.person_id = People.person_id)"
            ),
            "movie_count", // Alias cho kết quả đếm số lượng movie
          ],
        ],
      },
      group: ["People.person_id"],
    });

    if (!topPeople || topPeople.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No people found" },
      };
    }

    return { success: true, code: 200, data: topPeople };
  } catch (error) {
    throw error;
  }
};

module.exports = { getTopTenPeopleServices };
