import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { CustomError } from '../utils/customErrorClass.js';

const authMiddleware = asyncErrorHandler(async(req, res, next) => {
  let token;

  if (req.cookies.auth_token) {
    token = req.cookies.auth_token;
  } 
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    if (!decoded) {
      const error = new CustomError('Invalid Token', 401);
      return next(error);
    }
    
    req.user = await User.findById(decoded.id);

    next();
   
});

export default authMiddleware;
