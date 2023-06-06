const jwt = require('jsonwebtoken');



const verifyToken = (req, res, next) => {
    const {token} = req.body ;
    console.log(token)
    if (!token) {
        return res.status(401).json({
            message: 'You need to Authenticate'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid Token'
        })
    }
}




module.exports = verifyToken;
