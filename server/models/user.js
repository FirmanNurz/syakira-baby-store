'use strict';

const { hashPassword } = require('../helpers/bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Favorite, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'name is required'
        },
        notNull: {
          msg: 'name is required'
        }
      }
    },
    picture: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'picture is required'
        },
        notNull: {
          msg: 'picture is required'
        }
      },
      defaultValue: 'https://png.pngtree.com/png-clipart/20240709/original/pngtree-casual-man-flat-design-avatar-profile-picture-vector-png-image_15526568.png'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'email already exists'
      },
      validate: {
        notEmpty: {
          msg: 'email is required'
        },
        notNull: {
          msg: 'email is required'
        },
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password is required'
        },
        notNull: {
          msg: 'password is required'
        }
      },
      len: {
        args: 5,
        msg: 'Password must be at least 5 characters'
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  })
  return User;
};