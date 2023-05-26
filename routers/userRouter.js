const router = require('express').Router();
const verify = require('../middleware/verifyToken')
const { userSignup,userLogin,logout,resetPassword,
    getAllUsers,
    loginStatus,
    addHistory,getHistory} = require('../controllers/userController');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', logout);
router.post('/resetPassword',verify, resetPassword);
router.get('/getAllUsers', getAllUsers);
router.get("/loginStatus",loginStatus)
router.post('/addHistory',verify, addHistory);
 router.get('/getHistory',verify, getHistory);



module.exports = router;