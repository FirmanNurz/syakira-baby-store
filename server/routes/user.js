const userRouter = require('express').Router();
const UserContoller = require('../controllers/User');
const authentication = require('../middlewares/authentication');
const upload = require('../middlewares/multer');
const uploadPicture = upload.single('picture');


userRouter.get('/', UserContoller.getAll);
userRouter.post('/register', UserContoller.register);
userRouter.post('/login', UserContoller.login);
userRouter.post('/google-login', UserContoller.googleLogin);

userRouter.use(authentication)
userRouter.get('/profile', UserContoller.getProfile)
userRouter.patch('/update-image/', uploadPicture,UserContoller.updateImage);


module.exports = userRouter;