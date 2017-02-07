'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
        product_id: {
          type: Sequelize.INTEGER,
          references: {
              model: 'Products',
              key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      complete: {
        type: Sequelize.BOOLEAN
      },
      orderNumber: {
        type: Sequelize.INTEGER
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

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Orders');
  }
};
