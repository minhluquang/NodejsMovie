const { Op, where, Sequelize } = require("sequelize");
const {
  tvSeries,
  tvSeason,
  tvEpisode,
  TVSeriesCertification,
  Certification,
  TVSeriesNetwork,
  Network,
  SocialNetworkDetail,
  SocialNetwork,
  TVSeriesGenre,
  Genre,
  tvSeasonPeople,
  People,
  Keyword,
  TVSeriesKeyword,
  TVSeriesReview,
  Review,
  Account,
  AccountDetail,
  TVSeriesProductionCompany,
  ProductionCompany,
  TVSeriesImage,
  TVSeriesVideo,
} = require("../models");
const {
  getLastAirEpisode,
  getNextAirEpisode,
  getNextAirSeason,
  getLastAirSeason,
} = require("./tvSeason.services");

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
        success: true,
        code: 200,
        data: [],
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

// Get detail tv series
const getDetailTVSeriesServices = async (tv_series_id) => {
  try {
    const lastAirSeason = await getLastAirSeason(tv_series_id);

    const detailTVSeries = await tvSeries.findOne({
      where: { tv_series_id },
      include: [
        {
          model: TVSeriesCertification,
          as: "certifications",
          include: {
            model: Certification,
          },
        },
        {
          model: TVSeriesNetwork,
          as: "networks",
          include: {
            model: Network,
          },
        },
        {
          model: SocialNetworkDetail,
          as: "social_networks",
          include: { model: SocialNetwork },
        },
        {
          model: TVSeriesGenre,
          as: "genres",
          include: { model: Genre },
        },
        {
          model: tvSeason,
          where: { season_number: lastAirSeason.season_number },
          include: {
            model: tvSeasonPeople,
            as: "credits",
            include: { model: People },
            limit: 9,
            order: [[{ model: People }, "popularity", "desc"]],
          },
        },
        {
          model: TVSeriesKeyword,
          as: "keywords",
          include: { model: Keyword },
        },
        {
          model: TVSeriesReview,
          as: "reviews",
          include: {
            model: Review,
            include: {
              model: Account,
              include: { model: AccountDetail, as: "account_detail" },
            },
          },
          limit: 1,
          order: [[{ model: Review }, "createdAt", "DESC"]],
        },
        {
          model: TVSeriesProductionCompany,
          as: "production_companies",
          include: { model: ProductionCompany },
        },
      ],
    });

    if (!detailTVSeries || detailTVSeries.length === 0) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    // remove attributes not use in networks
    const result = detailTVSeries.toJSON();
    result.networks = result.networks.map((k) => ({
      network_id: k.Network.network_id,
      logo_path: k.Network.logo_path,
      name: k.Network.name,
    }));

    // remove attributes not use in social network
    result.social_networks = result.social_networks.map((k) => ({
      social_network_id: k.social_network_id,
      platform: k.SocialNetwork.platform,
      social_network_username: k.social_network_username,
    }));

    // remove attributes not use in genres
    result.genres = result.genres.map((k) => ({
      genre_id: k.Genre.genre_id,
      name: k.Genre.name,
    }));

    // remove attributes not use in keywords
    result.keywords = result.keywords.map((k) => ({
      keyword_id: k.Keyword.keyword_id,
      name: k.Keyword.name,
    }));

    // remove attributes not use in production_companies
    result.production_companies = result.production_companies.map((k) => ({
      production_company_id: k.ProductionCompany.production_company_id,
      name: k.ProductionCompany.name,
      original_country: k.ProductionCompany.original_country,
      logo_path: k.ProductionCompany.logo_path,
    }));

    // remove/add attributes (not) use in reviews
    const reviewCount = await TVSeriesReview.count({
      where: { tv_series_id },
    });

    result.reviews = result.reviews.map((k) => ({
      total_reviews: reviewCount,
      review_id: k.review_id,
      content: k.Review.content,
      rating: k.Review.rating,
      author: {
        account_id: k.Review.Account.account_id,
        username: k.Review.Account.username || null,
        name: k.Review.Account.name || null,
        profile_picture: k.Review.Account.profile_picture || null,
      },
      created_at: k.Review.createdAt,
    }));

    // create tv_season attr
    const episodeCount = await tvEpisode.count({
      where: { tv_season_id: lastAirSeason.tv_season_id },
    });

    result.last_air_season = {
      tv_season_id: lastAirSeason.tv_season_id,
      air_date: lastAirSeason.air_date,
      name: lastAirSeason.name,
      overview: lastAirSeason.overview,
      poster_path: lastAirSeason.poster_path,
      season_number: lastAirSeason.season_number,
      total_episodes: episodeCount,
      vote_average: lastAirSeason.vote_average,
      vote_average: lastAirSeason.vote_average,
    };

    result.last_episode_to_air = {
      tv_episode_id: lastAirSeason.episodes[0].tv_episode_id,
      air_date: lastAirSeason.episodes[0].air_date,
      episode_number: lastAirSeason.episodes[0].episode_number,
      episode_type: lastAirSeason.episodes[0].episode_type,
      name: lastAirSeason.episodes[0].name,
    };

    // Count seasons
    const totalSeasons = await tvSeason.findAll({
      where: { tv_series_id },
      attributes: [
        "tv_season_id",
        "season_number",
        "name",
        "overview",
        "air_date",
        "poster_path",
        "season_number",
        "vote_average",
        [
          Sequelize.fn("COUNT", Sequelize.col("episodes.tv_episode_id")),
          "episode_count",
        ],
      ],
      include: [
        {
          model: tvEpisode,
          as: "episodes",
          attributes: [],
        },
      ],
      group: ["tvSeason.tv_season_id"],
      order: [["season_number", "ASC"]],
    });

    result.number_of_seasons = totalSeasons.length;
    result.seasons = totalSeasons;

    // remove attributes not use in credits (tv seasons)
    const season = result.tvSeasons[0]; //tvSeason at 0 index cuz only one season we get (last air tv season)
    if (season.credits && Array.isArray(season.credits)) {
      result.credits = season.credits.map((k) => ({
        person_id: k.person_id,
        character_role: k.character_role,
        profile_path: k.Person.profile_path,
        name: k.Person.name,
      }));
    }

    // remove tvSeason, cuz we don't need it
    delete result.tvSeasons;

    // Return if have tv series
    return { success: true, code: 200, data: result };
  } catch (error) {
    throw error;
  }
};

const getAllTVSeriesImagesServices = async (tv_series_id) => {
  try {
    const tvSeriesImages = await TVSeriesImage.findAll({
      where: { tv_series_id, season: null, episode: null },
      include: {
        model: Account,
        as: "author",
        attributes: ["username"],
      },
    });

    if (!tvSeriesImages || tvSeriesImages.length === 0) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    const groupedImages = tvSeriesImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) {
        acc[type] = [];
      }

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
        author: image.author?.username || null,
      });
      return acc;
    }, {});

    return {
      success: true,
      code: 200,
      data: groupedImages,
    };
  } catch (error) {
    throw error;
  }
};

const getAllTVSeriesSeasonImagesServices = async (
  tv_series_id,
  season_number
) => {
  try {
    const tvSeriesSeasonImages = await TVSeriesImage.findAll({
      where: { tv_series_id, season: season_number, episode: null },
      include: {
        model: Account,
        as: "author",
        attributes: ["username"],
      },
    });

    if (!tvSeriesSeasonImages || tvSeriesSeasonImages.length === 0) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    const groupedImages = tvSeriesSeasonImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) {
        acc[type] = [];
      }

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
        author: image.author?.username || null,
      });
      return acc;
    }, {});

    return {
      success: true,
      code: 200,
      data: groupedImages,
    };
  } catch (error) {
    throw error;
  }
};

const getAllTVSeriesSeasonEpisodeImagesServices = async (
  tv_series_id,
  season_number,
  episode_number
) => {
  try {
    const tvSeriesSeasonEpisodeImages = await TVSeriesImage.findAll({
      where: { tv_series_id, season: season_number, episode: episode_number },
      include: {
        model: Account,
        as: "author",
        attributes: ["username"],
      },
    });

    if (
      !tvSeriesSeasonEpisodeImages ||
      tvSeriesSeasonEpisodeImages.length === 0
    ) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    const groupedImages = tvSeriesSeasonEpisodeImages.reduce((acc, image) => {
      const type = image.type;
      if (!acc[type]) {
        acc[type] = [];
      }

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
        author: image.author?.username || null,
      });
      return acc;
    }, {});

    return {
      success: true,
      code: 200,
      data: groupedImages,
    };
  } catch (error) {
    throw error;
  }
};

// get videos of tv_series by tv_series_id
const getAllTVSeriesVideosServices = async (tv_series_id) => {
  try {
    let tvSeriesVideos = await TVSeriesVideo.findAll({
      where: { tv_series_id, season: null, episode: null },
    });

    if (!tvSeriesVideos || tvSeriesVideos.length === 0) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    // remove attributes not use in tvSeriesVideos
    tvSeriesVideos = tvSeriesVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    return { success: true, code: 200, data: tvSeriesVideos };
  } catch (error) {
    throw error;
  }
};

// get videos of tv_seasons by tv_series_id
const getAllTVSeriesSeasonVideosServices = async (
  tv_series_id,
  season_number
) => {
  try {
    let tvSeriesSeasonVideos = await TVSeriesVideo.findAll({
      where: { tv_series_id, season: season_number, episode: null },
    });

    if (!tvSeriesSeasonVideos || tvSeriesSeasonVideos.length === 0) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    // remove attributes not use in tvSeriesSeasonVideos
    tvSeriesSeasonVideos = tvSeriesSeasonVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    return { success: true, code: 200, data: tvSeriesSeasonVideos };
  } catch (error) {
    throw error;
  }
};

// get videos of tv_episodes by tv_series_id
const getAllTVSeriesSeasonEpisodeVideosServices = async (
  tv_series_id,
  season_number,
  episode_number
) => {
  try {
    let tvSeriesSeasonEpisodeVideos = await TVSeriesVideo.findAll({
      where: { tv_series_id, season: season_number, episode: episode_number },
    });

    if (
      !tvSeriesSeasonEpisodeVideos ||
      tvSeriesSeasonEpisodeVideos.length === 0
    ) {
      return {
        success: true,
        code: 200,
        data: [],
      };
    }

    // remove attributes not use in tvSeriesSeasonVideos
    tvSeriesSeasonEpisodeVideos = tvSeriesSeasonEpisodeVideos.map((k) => ({
      name: k.name,
      key: k.video_key,
      site: k.site,
      type: k.type,
      official: k.official === 1,
      published_at: k.published_at,
    }));

    return { success: true, code: 200, data: tvSeriesSeasonEpisodeVideos };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPopularTVSeriesServices,
  getDetailTVSeriesServices,
  getAllTVSeriesImagesServices,
  getAllTVSeriesSeasonImagesServices,
  getAllTVSeriesSeasonEpisodeImagesServices,
  getAllTVSeriesVideosServices,
  getAllTVSeriesSeasonVideosServices,
  getAllTVSeriesSeasonEpisodeVideosServices,
};
