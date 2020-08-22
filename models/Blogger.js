const { Model, DataTypes } = require('sequelize'); // Import these two objects from Sequelize. 
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');


// Create the "Blogger" as an extension of Sequelize's native "Model" object.
class Blogger extends Model {
  // Set up method to run on instance data (per Blogger) to check password
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Define table columns and configuration. 
// Initialize the model's data and configuration, passing in two objects as arguments.
Blogger.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 15]
      }
    }
  },
  {
    hooks: {
      async beforeCreate(newBloggerData) {
        newBloggerData.password = await bcrypt.hash(newBloggerData.password, 10);
        return newBloggerData;
      },
      async beforeUpdate(updatedBloggerData) {
        updatedBloggerData.password = await bcrypt.hash(updatedBloggerData.password, 10);
        return updatedBloggerData;
      }
    },
    sequelize,
    timestamps: false, // Don't automatically create createdAt/updatedAt timestamp fields.
    freezeTableName: true, // Don't pluralize name of database table.
    underscored: true, // Use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    modelName: 'blogger' // Ensure model name remains lowercase in the database.
  }
);

module.exports = Blogger;