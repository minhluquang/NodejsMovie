"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SocialNetworkDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SocialNetworkDetail.belongsTo(models.SocialNetwork, {
        foreignKey: "social_network_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      SocialNetworkDetail.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  SocialNetworkDetail.init(
    {
      social_network_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Account",
          key: "account_id",
        },
      },
      person_id: {
        type: DataTypes.INTEGER,
      },
      movie_id: {
        type: DataTypes.INTEGER,
      },
      tv_series_id: {
        type: DataTypes.INTEGER,
      },
      social_network_username: {
        type: DataTypes.STRING(50),
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "SocialNetworkDetail",
      tableName: "social_network_details",
      timestamps: false,
    }
  );
  return SocialNetworkDetail;
};
