require("dotenv").config()
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASWORD,
	{
		dialect: `postgres`,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT
	}
)

// const sequelize = new Sequelize({
// 	host: 'localhost',
// 	port: 5432,
// 	dialect: 'postgres',
// 	database: 'lebedev',
// 	username: 'postgres',
// 	password: 'MORISGRISHA',
// });

module.exports = {sequelize};
