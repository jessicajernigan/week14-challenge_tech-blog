const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Establish the Blogpost model as an extension of Sequelize's native "Model" object.
class Blogpost extends Model {}


// Create the innards of a Blogpost.
Blogpost.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      // validate: {
      //   len: [10]
      // }
    },
    blogger_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'blogger',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'blogpost'
  }
);

module.exports = Blogpost;