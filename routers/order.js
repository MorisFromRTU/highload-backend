const Router = require('express');
const router = new Router();
const orderController = require("./controllers/orderController");

router.get("/getall", orderController.getAll);
router.get("/getone", orderController.getOne);
router.post("/neworder", orderController.create);

module.exports = router;