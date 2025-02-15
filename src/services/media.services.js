const { Op } = require("sequelize");
const {
  Movie,
  tvSeries,
  tvSeason,
  MovieImage,
  MovieVideo,
  TVSeriesImage,
  TVSeriesVideo,
} = require("../models");
const {
  getLastAirEpisode,
  getNextAirEpisode,
  getNextAirSeasons,
} = require("./tvSeason.services");
const _ = require("lodash");

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

const getAllMovieMultiMediaSerices = async (movie_id) => {
  try {
    // Get images
    const movieImages = await MovieImage.findAll({ where: { movie_id } });
    const groupedImages = movieImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) acc[type] = [];
      const {
        aspect_ratio,
        iso_639_1,
        height,
        width,
        file_path,
        vote_average,
        vote_count,
      } = image.dataValues;
      acc[type].push({
        aspect_ratio,
        iso_639_1,
        height,
        width,
        file_path,
        vote_average,
        vote_count,
      });
      return acc;
    }, {});

    // Get videos
    let movieVideos = await MovieVideo.findAll({ where: { movie_id } });
    movieVideos = movieVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    if (!movieImages.length && !movieVideos.length) {
      return {
        success: false,
        code: 404,
        data: { msg: "No media found." },
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        images: groupedImages,
        videos: movieVideos,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getAllTVSeriesMultiMediaServices = async (tv_series_id) => {
  try {
    // Get images
    const tvSeriesImages = await TVSeriesImage.findAll({
      where: { tv_series_id, season: null, episode: null },
    });

    const groupedImages = tvSeriesImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) acc[type] = [];
      const {
        aspect_ratio,
        height,
        width,
        iso_639_1,
        file_path,
        vote_average,
        vote_count,
      } = image.dataValues;
      acc[type].push({
        aspect_ratio,
        height,
        width,
        iso_639_1,
        file_path,
        vote_average,
        vote_count,
      });
      return acc;
    }, {});

    // Get videos
    let tvSeriesVideos = await TVSeriesVideo.findAll({
      where: { tv_series_id, season: null, episode: null },
    });

    tvSeriesVideos = tvSeriesVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    if (!tvSeriesImages.length && !tvSeriesVideos.length) {
      return {
        success: false,
        code: 404,
        data: { msg: "No media found." },
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        images: groupedImages,
        videos: tvSeriesVideos,
      },
    };
  } catch (error) {
    throw error;
  }
};

const getVideoTrailersServices = async () => {
  try {
    let movieVideoTrailer = await MovieVideo.findAll({
      where: { site: "Youtube", type: "Trailer", official: 1 },
      include: {
        model: Movie,
      },
    });

    let tvSeriesTrailer = await TVSeriesVideo.findAll({
      where: { site: "Youtube", type: "Trailer", official: 1 },
      include: {
        model: tvSeries,
      },
    });

    if (!movieVideoTrailer.length && !tvSeriesTrailer.length) {
      return {
        success: false,
        code: 404,
        data: { msg: "No video trailer found." },
      };
    }

    // remove attributes not use in movieVideoTrailer
    movieVideoTrailer = movieVideoTrailer.map((k) => ({
      key: k.video_key,
      name: k.name,
      site: k.site,
      type: k.type,
      published_at: k.published_at,
      id: k.movie_id,
      backdrop_path: k.Movie.backdrop_path,
      title: k.Movie.title,
      original_title: k.Movie.original_title,
      popularity: k.Movie.popularity,
      vote_average: k.Movie.vote_average,
      vote_count: k.Movie.vote_count,
      media_type: "movie",
    }));

    // remove attributes not use in tvSeriesTrailer
    tvSeriesTrailer = tvSeriesTrailer.map((k) => ({
      key: k.video_key,
      name: k.name,
      site: k.site,
      type: k.type,
      published_at: k.published_at,
      id: k.tv_series_id,
      backdrop_path: k.tvSery.backdrop_path,
      title: k.tvSery.title,
      original_title: k.tvSery.original_title,
      popularity: k.tvSery.popularity,
      vote_average: k.tvSery.vote_average,
      vote_count: k.tvSery.vote_count,
      media_type: "tv",
    }));

    let combinedTrailers = [...movieVideoTrailer, ...tvSeriesTrailer];
    combinedTrailers = _.orderBy(
      combinedTrailers,
      ["published_at", "popularity", "vote_count", "vote_average"],
      ["desc", "desc", "desc", "desc"]
    );
    combinedTrailers = combinedTrailers.slice(0, 20);

    return {
      success: true,
      code: 200,
      data: [...combinedTrailers],
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTrendingMediasServices,
  getAllMovieMultiMediaSerices,
  getAllTVSeriesMultiMediaServices,
  getVideoTrailersServices,
};
