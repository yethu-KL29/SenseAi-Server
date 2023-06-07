const router = require('express').Router();
const verify = require('../middleware/verifyToken')
const { userSignup,userLogin,logout,resetPassword,
    getAllUsers,
    loginStatus,
    addHistory,getHistory} = require('../controllers/userController');

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', logout);
router.post('/resetPassword', resetPassword);
router.get('/getAllUsers', getAllUsers);
router.get("/loginStatus",loginStatus)
router.post('/addHistory',verify, addHistory);
 router.post('/getHistory',verify, getHistory);



module.exports = router;