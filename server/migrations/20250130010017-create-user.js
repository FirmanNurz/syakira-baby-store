'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Name is required'
          },
          notNull: {
            msg: 'Name is required'
          }
        }
      },
      picture: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Picture is required'
          },
          notNull: {
            msg: 'Picture is required'
          }
        },
        defaultValue: 'https://png.pngtree.com/png-clipart/20240709/original/pngtree-casual-man-flat-design-avatar-profile-picture-vector-png-image_15526568.png'
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: {
          notEmpty: {
            msg: 'Email is required'
          },
          notNull: {
            msg: 'Email is required'
          },
          isEmail: {
            msg: 'Email format is incorrect'
          }
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Password is required'
          },
          notNull: {
            msg: 'Password is required'
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};