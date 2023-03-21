const {User, Basket, BasketItem} = require("../../models/model");
const bcrypt = require('bcrypt');
const {ApiError} = require("../../middleware/errorHandlerMiddleware");
const jwt = require('jsonwebtoken');

class useController{

	makeJWT(user)
	{
		const {id, login, email} = user;
		return jwt.sign(
			{id, login, email},
			process.env.JWT_Secret_Word,
			{expiresIn: "24h"}
		)
	}

	registration = async  (req, res, next) => {
		try{
			const {login, email, password} = req.body;
			if (!login || !email || !password)
			{
				return next(ApiError.userError("не указана почта или логин или пароль"));
			}
			let isAlreadyUser = await User.findOne({where: {email}});
			if (isAlreadyUser)
			{
				return next(ApiError.userError("пользователь с такой почтой уже существует"))
			}
			const hashpassword = await bcrypt.hash(password, 4);
			const newUser = await User.create({login, email, password: hashpassword});
			await Basket.create({UserId: newUser.id})
			const token = this.makeJWT(newUser);
			return res.json({user: {
				id: newUser.id,
				login: newUser.login,
				email: newUser.email,
			}, token});
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}

	login = async (req, res, next) => {
		try{
			const {email, password} = req.body;
			if (!email || !password)
			{
				return next(ApiError.userError("не указана почта или пароль"));
			}
			const user = await User.findOne({where: {email}});
			if (!user) {
				return next(ApiError.userError("такого пользователя не существует"));
			}
			let isPasswordCorrect = bcrypt.compareSync(password, user.password)
			if (!isPasswordCorrect){
				return next(ApiError.userError("неверный пароль"));
			}
			const token = this.makeJWT(user);
			return res.json({user: {
				id: user.id,
				login: user.login,
				email: user.email,
			}, token});
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}

	delete = async(req, res, next) => {
		try{
			const {email, password} = req.body
			if (!email || !password)
			{
				return next(ApiError.userError("не указана почта или пароль"));
			}
			const user = await User.findOne({where: {email}});
			if (!user) {
				return next(ApiError.userError("такого пользователя не существует"));
			}
			let isPasswordCorrect = bcrypt.compareSync(password, user.password)
			if (!isPasswordCorrect){
				return next(ApiError.userError("неверный пароль"));
			}
			const basket = await Basket.findOne({where: {UserId: user.id}});
			const arrOfBasketItems = await BasketItem.findAll({where :{BasketId: basket.id}});
			arrOfBasketItems.forEach(async (item) => { await item.destroy();});
			await basket.destroy();
			await user.destroy();
			return res.json({});
		}
		catch(e)
		{
			return next(ApiError.userError(e.messadge));
		}
	}

	async check(req, res, next){
		try{
			const token = req.headers.authorization;
			if (!token)
			{
				return next(ApiError.userError("Не авторизован"))
			}
			const decoded = jwt.verify(token, process.env.JWT_Secret_Word)
			return res.json(decoded);
		}
		catch(e){
			return next(ApiError.userError(e.messadge))
		}
	}
}

module.exports = new useController();