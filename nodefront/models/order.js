'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      complete: DataTypes.BOOLEAN,
      orderNumber: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Order;
};