const productRouter = require('express').Router();
const ProductController = require('../controllers/Product');

productRouter.get('/gemini', ProductController.gemini);
productRouter.get('/', ProductController.getAll);
productRouter.get('/:id', ProductController.getOne);

module.exports = productRouter;