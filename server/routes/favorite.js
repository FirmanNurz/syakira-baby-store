const favoriteRouter = require('express').Router();
const FavoriteController = require('../controllers/Favorite');

favoriteRouter.get('/', FavoriteController.getByUserLogin);
favoriteRouter.post('/', FavoriteController.create);
favoriteRouter.delete('/:id', FavoriteController.delete);

module.exports = favoriteRouter;