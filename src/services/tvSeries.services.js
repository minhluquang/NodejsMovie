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
      ],
    });

    if (!detailTVSeries || detailTVSeries.length === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "No tv series found" },
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

    // Return if have movie
    return { success: true, code: 200, data: result };
  } catch (error) {
    throw error;
  }
};

module.exports = { getPopularTVSeriesServices, getDetailTVSeriesServices };
