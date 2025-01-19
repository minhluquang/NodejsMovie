"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccountDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AccountDetail.belongsTo(models.Account, {
        foreignKey: "account_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  AccountDetail.init(
    {
      account_detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Account",
          key: "account_id",
        },
      },
      profile_picture: DataTypes.STRING(500),
      gender: DataTypes.TINYINT(1),
      name: DataTypes.STRING(255),
      description: DataTypes.STRING(255),
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "AccountDetail",
      tableName: "account_details",
      timestamps: false,
    }
  );
  return AccountDetail;
};
