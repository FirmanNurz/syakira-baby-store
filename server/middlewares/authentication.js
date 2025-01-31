const { User } = require('../models');
const { verifyToken } = require('../helpers/jwt');

const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) throw { name: 'Unauthorized' }

        const token = authorization.split(' ')[1];

        if (!token) throw { name: 'Unauthorized' }

        const payload = verifyToken(token);

        const user = await User.findOne({
            where: {
                email: payload.email
            }
        });

        if (!user) throw { name: 'Unauthorized' }

        req.loginInfo = {
            user_id: user.id,
            email: user.email
        }

        next();

    } catch (error) {
        next(error)
    }
}

module.exports = authentication;