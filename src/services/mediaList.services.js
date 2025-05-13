const { List, MediaList, Movie, tvSeries, sequelize } = require("../models");

// const add media into list
const addMediaIntoListServices = async (
  list_id,
  media_id,
  media_type,
  account_id,
  description
) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    if (media_type !== "movie" && media_type !== "tv") {
      return { success: false, code: 400, data: { msg: "Invalid media type" } };
    }

    if (media_type === "movie") {
      const media = await List.findAll({
        include: [
          {
            model: MediaList,
            as: "media_lists",
            where: { type: media_type, movie_id: media_id },
          },
        ],
        where: { account_id, list_id },
      });

      if (media.length > 0) {
        return {
          success: false,
          code: 409,
          data: { msg: "Media already exists in the list" },
        };
      }
    } else if (media_type === "tv") {
      const media = await List.findAll({
        include: [
          {
            model: MediaList,
            as: "media_lists",
            where: { type: media_type, tv_series_id: media_id },
          },
        ],
        where: { account_id, list_id },
      });

      if (media.length > 0) {
        return {
          success: false,
          code: 409,
          data: { msg: "Media already exists in the list" },
        };
      }
    }

    let newMedia;
    if (media_type === "movie") {
      newMedia = await MediaList.create(
        {
          list_id: Number(list_id),
          movie_id: media_id,
          tv_series_id: null,
          type: media_type,
          description,
          added_at: new Date(),
        },
        { transaction }
      );
    } else if (media_type === "tv") {
      newMedia = await MediaList.create(
        {
          list_id: Number(list_id),
          movie_id: null,
          tv_series_id: media_id,
          type: media_type,
          description,
          added_at: new Date(),
        },
        { transaction }
      );
    }

    transaction.commit();

    return { success: true, code: 201, data: newMedia };
  } catch (error) {
    await transaction.rollback();
    throw new Error("Error adding media to list: " + error.message);
  }
};

// update media in list
const updateMediaListServices = async (
  list_id,
  account_id,
  media_id,
  media_type,
  description
) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const list = await List.findOne({
      where: { list_id, account_id },
    });

    if (!list) {
      return {
        success: false,
        code: 404,
        data: { msg: "List not found" },
      };
    }
    console.log(list_id, media_id, media_type);
    let mediaList;
    if (media_type === "movie") {
      mediaList = await MediaList.findOne({
        where: { list_id, movie_id: media_id },
      });

      if (!mediaList) {
        return {
          success: false,
          code: 404,
          data: { msg: "Movie not found" },
        };
      }
    } else if (media_type === "tv") {
      mediaList = await MediaList.findOne({
        where: { list_id, tv_series_id: media_id },
      });

      if (!mediaList) {
        return {
          success: false,
          code: 404,
          data: { msg: "TV series not found" },
        };
      }
    }
    if (!mediaList) {
      return {
        success: false,
        code: 404,
        data: { msg: "Media not found in list" },
      };
    }

    await mediaList.update({ description }, { transaction });
    await transaction.commit();

    return { success: true, code: 200, data: { msg: "Update successful" } };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw new Error("Error saving media to list: " + error.message);
  }
};

// remove media from list
const removeMediaFromListServices = async (
  list_id,
  account_id,
  media_id,
  media_type
) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const list = await List.findOne({
      where: { list_id, account_id },
    });

    if (!list) {
      return {
        success: false,
        code: 404,
        data: { msg: "List not found" },
      };
    }

    let mediaList;
    if (media_type === "movie") {
      mediaList = await MediaList.findOne({
        where: { list_id, movie_id: media_id },
      });
    } else if (media_type === "tv") {
      mediaList = await MediaList.findOne({
        where: { list_id, tv_series_id: media_id },
      });
    }

    if (!mediaList) {
      return {
        success: false,
        code: 404,
        data: { msg: "Media not found in list" },
      };
    }

    await mediaList.destroy({ transaction });
    await transaction.commit();

    return {
      success: true,
      code: 200,
      data: { msg: "Media removed successfully" },
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw new Error("Error removing media from list: " + error.message);
  }
};

const removeAllMediaFromListServices = async (list_id, account_id) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const list = await List.findOne({
      where: { list_id, account_id },
    });

    if (!list) {
      return {
        success: false,
        code: 404,
        data: { msg: "List not found" },
      };
    }

    await MediaList.destroy({
      where: { list_id },
      transaction,
    });

    await transaction.commit();

    return {
      success: true,
      code: 200,
      data: { msg: "All media removed successfully" },
    };
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw new Error("Error removing all media from list: " + error.message);
  }
};

module.exports = {
  addMediaIntoListServices,
  updateMediaListServices,
  removeMediaFromListServices,
  removeAllMediaFromListServices,
};
