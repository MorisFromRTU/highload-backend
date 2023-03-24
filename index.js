require("dotenv").config()
const express = require("express");
const sequelize = require("./db").sequelize;;
const fileUpload = require('express-fileupload')
const cors = require("cors");
const path = require('path');
const models = require("./models/model");
const router = require("./routers/index");
const {ErrorHandler} = require("./middleware/errorHandlerMiddleware");
const http = require("http");
const res = require("express/lib/response");
const app = express();

const Port = process.env.PORT || 8080

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/', router)
app.use(ErrorHandler)

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.dropSchema('public', {});
		await sequelize.createSchema('public', {});
		await sequelize.sync();
		console.log('Sequelize was initialized');
	} catch (error) {
		console.log(error);
		process.exit();
	}
}

start()
http.createServer(app).listen(3000, () => {
	app.get('/', function(req, res){
		res.sendfile('./tupaya.html');
	});
	console.log('Server is working on port 3000');
});
