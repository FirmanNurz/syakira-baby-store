const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');
const cloudinary = require('../middlewares/cloudinary');
const { User } = require('../models');

class UserContoller {

    static async getAll(req, res, next) {
        try {
            const users = await User.findAll()

            res.status(200).json({
                users
            })


        } catch (err) {
            next(err)
        }
    }
    static async register(req, res, next) {
        try {
            const { name, picture, email, password } = req.body;

            const newUser = await User.create({ name, picture, email, password });

            res.status(201).json({
                message: 'Success added new account',
                newUser
            })

        } catch (err) {
            next(err)
        }
    }

    static async getProfile(req, res, next) {
        try {
            const { user_id } = req.loginInfo

            if (!user_id) throw { name: 'Unauthorized' }

            const user = await User.findByPk(user_id)

            res.status(200).json({
                user
            })

        } catch (err) {
            next(err)
        }
    }
    static async login(req, res, next) {
        // console.log('masuk login');
        
        try {
            const { email, password } = req.body

            if (!email || !password) throw { name: 'LoginError' }


            const user = await User.findOne({ where: { email } })

            if (!user) throw { name: 'NotFound' }

            if (!comparePassword(password, user.password)) throw { name: 'LoginError' }

            const payload = {
                user_id: user.id,
                email: user.email
            }

            const accessToken = signToken(payload)

            res.status(200).json({
                message: 'Success login',
                accessToken
            })
        } catch (err) {
            next(err)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'Google token is required' });
            }

            const client = new OAuth2Client("407275464612-9rtdjrqo57rn2c5jl8vi0c1cchv2dqgv.apps.googleusercontent.com");

            const ticket = await client.verifyIdToken({
                idToken: token,
            });

            const googlePayload = ticket.getPayload();

            if (!googlePayload.email) {
                return res.status(400).json({ message: 'Email not found in Google profile' });
            }

            const [user, created] = await User.findOrCreate({
                where: {
                    email: googlePayload.email
                },
                defaults: {
                    name: googlePayload.name || 'Google User',
                    picture: googlePayload.picture || 'https://via.placeholder.com/150',
                    email: googlePayload.email,
                    password: Math.random().toString(36).slice(-8) // Generate a random temporary password
                },
                hooks: false
            });

            const payload = {
                user_id: user.id,
                email: user.email
            }

            const accessToken = signToken(payload)

            res.status(200).json({
                message: 'Success login',
                accessToken,
                isNewUser: created
            })
        } catch (err) {
            console.error('Google login error:', err);
            next(err)
        }
    }

    static async updateImage(req, res, next) {
        try {
            const { user_id } = req.loginInfo
            const { picture } = req.body

            const user = await User.findByPk(user_id)

            if (!user) throw { name: 'NotFound' }

            let pictureUrl;

            // If a file is uploaded, use Cloudinary
            if (req.file) {
                const image = req.file.buffer.toString('base64')
                const base64 = `data:${req.file.mimetype};base64,${image}`;

                const upload = await cloudinary.uploader.upload(base64, {
                    public_id: `user_${user_id}_profile`,
                    tags: ["profile"]
                })

                pictureUrl = upload.secure_url
            } 
            // If a picture URL is provided directly
            else if (picture) {
                pictureUrl = picture
            } 
            // If no picture is provided
            else {
                throw { name: 'BadRequest', message: 'No image provided' }
            }

            await User.update({
                picture: pictureUrl
            }, {
                where: { id: user_id }
            })

            res.status(201).json({
                message: 'Success update image',
                picture: pictureUrl
            })

        } catch (err) {
            next(err)
        }
    }
}

module.exports = UserContoller;