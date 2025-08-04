import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const roleAuth = (...roles) => {
   
    return (req, res, next) => {
        
      if (!roles.includes(req.user.role)) {
        
        return next(
          new ApiError(
           400, `User with this role(${req.user.role}) not allowed to access this resource`
          )
        );
      }

      next();
    };
  };

export {roleAuth}