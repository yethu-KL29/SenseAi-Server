const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.session.token; // Retrieve the token from the session

  if (!token) {
    return res.status(401).json({
      message: 'You need to authenticate',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};

module.exports = verifyToken;
