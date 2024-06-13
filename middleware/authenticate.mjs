import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authUtils from './authUtils.mjs';

dotenv.config();

class AuthMiddleware {
  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY;
  }
  authenticateToken = async (req, res, next) => {
    
    if (authUtils.authorizationIgnotrePath.includes(req.url)) {
      return next(); // Skip authentication for excluded routes
    }
    const token = req.headers.token;
    // console.log('Token from headers:', token);
    if (!token) return res.status(401).json({success: false, message: 'token required'});
    try {
      // const user = jwt.verify(token, this.secretKey);
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({success: false,error: 'unauthorized',error:err});;
    }
  };

  authorizeRole =  (requiredRole) => {
    return async (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return res.status(403).send('Cannot access');
      }
      next();    
    }
  }
}

const authMiddlewareInstance = new AuthMiddleware();
export default authMiddlewareInstance;

