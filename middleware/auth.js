const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Bearer xxx
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // { userId, role, region }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

module.exports = { auth, requireAdmin };
