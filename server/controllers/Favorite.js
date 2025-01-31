const { Favorite, User, Product } = require('../models');

class FavoriteController {
    static async getAll(req, res, next) {
        try {
            const favorites = await Favorite.findAll({
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'description', 'price', 'stock', 'storeName', 'imageUrl', 'address', 'category']
                    }
                ]
            })

            res.status(200).json({
                favorites
            })
        } catch (err) {
            next(err)
        }
    }

    static async getByUserLogin(req, res, next) {
        try {
            const { user_id } = req.loginInfo

            const favorites = await Favorite.findAll({
                where: {
                    userId: user_id
                },
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'name', 'description', 'price', 'stock', 'storeName', 'imageUrl', 'address', 'category']
                    }
                ]
            })

            res.status(200).json({
                favorites
            })
        } catch (err) {
            next(err)
        }
    }

    static async create(req, res, next) {
        try {
            const { productId } = req.body
            const user_id = req.loginInfo.user_id

            if (!productId) throw { name: 'BadRequest' }

            const product = await Product.findOne({
                where: {
                    id: productId
                }
            })

            if (!product) throw { name: 'NotFound' }

            const isFavorite = await Favorite.findOne({
                where: {
                    userId: user_id,
                    productId
                }
            })

            if (isFavorite) throw { name: 'Conflict' }

            const favorite = await Favorite.create({
                userId: user_id,
                productId
            })

            res.status(201).json({
                favorite
            })
        } catch (err) {
            next(err)
        }
    }

    static async delete(req, res, next) {
        try {
            const { id } = req.params
            const userId = req.loginInfo.user_id

            const favorite = await Favorite.findOne({
                where: {
                    userId,
                    id,
                }
            })

            if (!favorite) throw { name: 'NotFound' }

            await favorite.destroy()

            res.status(200).json({
                message: 'Favorite has been deleted'
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = FavoriteController;