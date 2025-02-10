"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Network extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Network.hasMany(models.TVSeriesNetwork, {
        foreignKey: "network_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Network.init(
    {
      network_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      logo_path: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      original_country: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Network",
      tableName: "networks",
      timestamps: true,
    }
  );

  return Network;
};
