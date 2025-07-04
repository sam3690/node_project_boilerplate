const Auth = require('../models/Auth');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      const user = await Auth.user(token);
      req.user = user;
      next();
    } catch (tokenError) {
      if (tokenError.message.includes('expired')) {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      } else if (tokenError.message.includes('Invalid')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token.'
        });
      } else {
        throw tokenError;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

module.exports = auth;
