const { name } = require("ejs");
const { List, MediaList, Movie, tvSeries, sequelize } = require("../models");

const getListByAccountIdServices = async (account_id) => {
  try {
    const lists = await List.findAll({
      where: { account_id },
      order: [["created_at", "DESC"]],
    });

    return { success: true, code: 200, data: lists };
  } catch (error) {
    throw new Error("Error fetching lists by account ID: " + error.message);
  }
};

const createNewListServices = async (
  account_id,
  name,
  description,
  is_public,
  is_comment,
  sort_by
) => {
  let transaction;
  try {
    const transaction = await sequelize.transaction();

    const newList = await List.create(
      {
        account_id,
        name,
        description,
        is_public,
        is_comment,
        sort_by,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction }
    );

    newList.is_public = is_public ? 1 : 0;
    newList.is_comment = is_comment ? 1 : 0;

    await transaction.commit();

    return { success: true, code: 201, data: newList };
  } catch (error) {
    await transaction.rollback();
    throw new Error("Error creating new list: " + error.message);
  }
};

const updateNewListServices = async (
  id,
  account_id,
  name,
  description,
  is_public,
  is_comment,
  sort_by
) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const updatedList = await List.update(
      {
        name,
        description,
        is_public,
        is_comment,
        sort_by,
        updated_at: new Date(),
      },
      { where: { list_id: id, account_id } },
      { transaction }
    );

    if (updatedList[0] === 0) {
      return {
        success: false,
        code: 404,
        data: { msg: "List not found or not updated" },
      };
    }

    const data = {
      list_id: Number(id),
      account_id,
      name,
      description,
      is_public: is_public ? 1 : 0,
      is_comment: is_comment ? 1 : 0,
      sort_by,
    };

    await transaction.commit();

    return { success: true, code: 200, data };
  } catch (error) {
    await transaction.rollback();
    throw new Error("Error updating list: " + error.message);
  }
};

// Get list by account_id and list_id
const getListByAccountIdAndListIdServices = async (account_id, list_id) => {
  try {
    const rawList = await List.findOne({
      where: { account_id, list_id },
      include: [
        {
          model: MediaList,
          as: "media_lists",
          include: [
            { model: Movie, attributes: ["original_title", "title"] },
            { model: tvSeries, attributes: ["name", "original_name"] },
          ],
        },
      ],
    });

    if (!rawList) {
      return { success: false, code: 404, data: { msg: "List not found" } };
    }

    const list = rawList.toJSON();
    list.media_lists = list.media_lists.map((media) => {
      if (media.type === "movie") {
        return {
          ...media,
          title: media.Movie?.title,
          original_title: media.Movie?.original_title,
          Movie: undefined,
          tvSery: undefined,
        };
      } else if (media.type === "tv") {
        return {
          ...media,
          name: media.tvSery?.name,
          original_name: media.tvSery?.original_name,
          Movie: undefined,
          tvSery: undefined,
        };
      }
    });

    return { success: true, code: 200, data: list };
  } catch (error) {
    throw new Error(
      "Error fetching list by account ID and list ID: " + error.message
    );
  }
};

// const add media into list
const addMediaToListServices = async (
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
          code: 400,
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
          code: 400,
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

module.exports = {
  getListByAccountIdServices,
  createNewListServices,
  updateNewListServices,
  getListByAccountIdAndListIdServices,
  addMediaToListServices,
};
