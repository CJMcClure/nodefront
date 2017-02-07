'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    first: DataTypes.STRING,
    last: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    ordercount: DataTypes.INTEGER,
    admin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};