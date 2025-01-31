'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
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
      description: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Description is required'
          },
          notNull: {
            msg: 'Description is required'
          }
        }
      },
      price: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: {
            msg: 'Price is required'
          },
          notNull: {
            msg: 'Price is required'
          }
        }
      },
      stock: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: {
            msg: 'Stock is required'
          },
          notNull: {
            msg: 'Stock is required'
          }
        }
      },
      storeName: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Store name is required'
          },
          notNull: {
            msg: 'Store name is required'
          }
        }
      },
      imageUrl: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Image URL is required'
          },
          notNull: {
            msg: 'Image URL is required'
          }
        }
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Address is required'
          },
          notNull: {
            msg: 'Address is required'
          }
        }
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: 'Category is required'
          },
          notNull: {
            msg: 'Category is required'
          }
        }
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
    await queryInterface.dropTable('Products');
  }
};