const jwt = require('jsonwebtoken');



const verifyToken = (req, res, next) => {
    const cookie = req.headers.cookie;
    if(!cookie){
        return res.status(401).json({
            message: 'You need to Authenticate'
        })
    }
    const token = cookie && cookie.split('=')[1];
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


