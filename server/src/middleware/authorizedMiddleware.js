import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { CustomError } from "../utils/customErrorClass.js";

const authorizeMiddleware = asyncErrorHandler(async (req, res, next) => {
    
    if (req.user.role !== "doctor") {
        const err = new CustomError("Unauthorized access", 401);
        return next(err);
      }
      next();
});

export default authorizeMiddleware;