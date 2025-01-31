const authentication = require('../middlewares/authentication');
const favoriteRouter = require('./favorite');
const productRouter = require('./product');
const userRouter = require('./user');

const router = require('express').Router();

router.use('/user', userRouter)

router.use('/products', productRouter);

router.use(authentication)
router.use('/favorite', favoriteRouter)

module.exports = router;