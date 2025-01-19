"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SocialNetwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SocialNetwork.hasMany(models.SocialNetworkDetail, {
        foreignKey: "social_network_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  SocialNetwork.init(
    {
      social_network_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      platform: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "SocialNetwork",
      tableName: "social_networks",
      timestamps: false,
    }
  );
  return SocialNetwork;
};
