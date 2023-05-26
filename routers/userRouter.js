const router = require('express').Router();
const verify = require('../middleware/verifyToken')
const { userSignup,userLogin,logout,resetPassword,
    getAllUsers,
    loginStatus,
    addHistory} = require('../controllers/userController');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', logout);
router.post('/resetPassword',verify, resetPassword);
router.get('/getAllUsers', getAllUsers);
router.get("/loginStatus",loginStatus)
router.post('/add',verify, addHistory);



module.exports = router;