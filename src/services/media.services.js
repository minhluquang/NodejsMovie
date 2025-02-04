const { Op } = require("sequelize");
const { Movie, tvSeries, tvSeason } = require("../models");
const {
  getLastAirEpisode,
  getNextAirEpisode,
  getLastAirSeasons,
} = require("./tvSeason.services");

const getTrendingMediasServices = async (type) => {
  try {
    let trendingTVSeries = [];
    let trendingMovies = [];

    if (type === "today") {
      // Trending TV Series
      const thisWeekTVSeries = await tvSeries.findAll({
        include: {
          model: tvSeason,
          where: {
            air_date: {
              [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)),
              [Op.lte]: new Date(), // <= today
            },
          },
        },
        order: [
          [tvSeason, "season_number", "desc"],
          ["popularity", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],

        limit: 20,
      });

      var sortTVSeason = thisWeekTVSeries.sort((a, b) => {
        return (
          new Date(b.tvSeasons[0].air_date) - new Date(a.tvSeasons[0].air_date)
        );
      });

      sortTVSeason = sortTVSeason.sort((a, b) => {
        return (
          new Date(b.tvSeasons[0].vote_average) -
          new Date(a.tvSeasons[0].vote_average)
        );
      });

      trendingTVSeries = trendingTVSeries.map((series) => {
        let plainSeries = series.get({ plain: true });
        delete plainSeries.tvSeasons;
        return {
          ...plainSeries,
          media_type: "tv",
        };
      });

      if (trendingTVSeries.length < 20) {
        const lastYearTVSeries = await tvSeries.findAll({
          include: {
            model: tvSeason,
            where: {
              air_date: {
                [Op.gte]: new Date(
                  new Date().setDate(new Date().getDate() - 7)
                ),
                [Op.lte]: new Date(), // <= today
              },
            },
          },
          order: [
            [tvSeason, "season_number", "desc"],
            ["popularity", "desc"],
            ["vote_count", "desc"],
            ["vote_average", "desc"],
          ],

          limit: 20 - trendingTVSeries.length,
        });

        trendingTVSeries = trendingTVSeries.map((series) => {
          let plainSeries = series.get({ plain: true });
          delete plainSeries.tvSeasons;
          return {
            ...plainSeries,
            media_type: "tv",
          };
        });
      }

      // Trending Movies
      const thisWeekMovies = await Movie.findAll({
        where: {
          release_date: {
            [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)), // >= 7 days ago
            [Op.lte]: new Date(), // <= today
          },
        },
        order: [
          ["popularity", "desc"],
          ["release_date", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],
        limit: 20,
      });

      trendingMovies = thisWeekMovies.map((movie) => ({
        ...movie.get({ plain: true }),
        media_type: "movie",
      }));

      if (trendingMovies.length < 20) {
        const lastYearMovies = await Movie.findAll({
          where: {
            release_date: {
              [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 7)), // <= 7 days ago
              [Op.gte]: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1) // >= a year ago
              ),
            },
          },
          order: [
            ["popularity", "desc"],
            ["release_date", "desc"],
            ["vote_count", "desc"],
            ["vote_average", "desc"],
          ],
          limit: 20 - trendingMovies.length,
        });

        trendingMovies = trendingMovies.concat(
          lastYearMovies.map((movie) => ({
            ...movie.get({ plain: true }),
            media_type: "movie",
          }))
        );
      }
    } else {
      // Trending TV Series
      trendingTVSeries = await tvSeries.findAll({
        include: {
          model: tvSeason,
          where: {
            air_date: {
              [Op.lte]: new Date(), // <= today
            },
          },
        },
        order: [
          [tvSeason, "season_number", "desc"],
          ["popularity", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],
        limit: 20,
      });

      trendingTVSeries = trendingTVSeries.map((series) => {
        let plainSeries = series.get({ plain: true });
        delete plainSeries.tvSeasons;
        return {
          ...plainSeries,
          media_type: "tv",
        };
      });

      // Trending Movies
      trendingMovies = await Movie.findAll({
        where: {
          release_date: { [Op.lte]: new Date() },
        },
        order: [
          ["popularity", "desc"],
          ["release_date", "desc"],
          ["vote_count", "desc"],
          ["vote_average", "desc"],
        ],
        limit: 20,
      });

      trendingMovies = trendingMovies.map((movie) => ({
        ...movie.get({ plain: true }),
        media_type: "movie",
      }));
    }

    const trendingMedias = [...trendingTVSeries, ...trendingMovies];
    const sortByPopularity = (a, b) => b.popularity - a.popularity;
    const sortByReleaseDate = (a, b) => {
      const dateA = new Date(
        a.media_type === "movie" ? a.release_date : a.tvSeasons?.[0]?.air_date
      );
      const dateB = new Date(
        b.media_type === "movie" ? b.release_date : b.tvSeasons?.[0]?.air_date
      );
      return dateB - dateA;
    };
    const sortByVoteCount = (a, b) => b.vote_count - a.vote_count;
    const sortByVoteAverage = (a, b) => b.vote_average - a.vote_average;

    trendingMedias.sort(sortByPopularity);
    trendingMedias.sort(sortByReleaseDate);
    trendingMedias.sort(sortByVoteCount);
    trendingMedias.sort(sortByVoteAverage);

    const slicedTrendingMedias = trendingMedias.slice(0, 20);

    return { success: true, code: 200, data: slicedTrendingMedias };
  } catch (error) {
    throw error;
  }
};

module.exports = { getTrendingMediasServices };
