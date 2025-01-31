'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Favorite.belongsTo(models.Product, {
        foreignKey: 'productId'
      });
    }
  }
  Favorite.init({
    
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'User is required'
        },
        notNull: {
          msg: 'User is required'
        }
      },
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product is required'
        },
        notNull: {
          msg: 'Product is required'
        }
      },
      references: {
        model: 'Products',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};