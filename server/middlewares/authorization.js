const { Favorite } = require('../models');

const authorization = async (req, res, next) => {
    const { user_id } = req.loginInfo;
    try {
        const id = req.params;
        const favorite = await Favorite.findOne(id);

        if (!favorite) throw { name: 'NotFound' }

        if (favorite.userId !== user_id) throw { name: 'Forbidden' }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authorization;