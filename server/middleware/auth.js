const Auth = require('../models/Auth');

const auth = async (req, res, next) => {
  try {
    // Check if user is authenticated via session (Laravel-style)
    const user = await Auth.check(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated. Please login.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

module.exports = auth;
