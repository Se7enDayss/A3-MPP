const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./category')(sequelize, DataTypes);
db.Product = require('./product')(sequelize, DataTypes);

db.Category.hasMany(db.Product, { foreignKey: 'categoryId' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId' });

module.exports = db; 