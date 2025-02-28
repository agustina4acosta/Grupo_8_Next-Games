'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Address.init({
    address: DataTypes.STRING,
    province: DataTypes.STRING,
    municipio: DataTypes.STRING,
    localidad: DataTypes.STRING,
    codArea: DataTypes.INTEGER,
    telefono: DataTypes.STRING,
    zipCode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Address',
    timestamps:true
  });
  return Address;
};