import { Request, Response, NextFunction } from 'express';
import { User } from "../data/models/user.model";
import { UserRole } from "../data/enums/roles.enum";
import { AppError } from "../utils/appError";
import { HttpStatusCode } from "../data/enums/httpStatuses.enum";


export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', HttpStatusCode.FORBIDDEN)
      );
    }
    next();
  };
}

export const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const requireRole = (role: UserRole) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user.role !== role) {
      return res.status(403).send(`You don't have permission to access this resource`);
    }

    next();
  };
}

export const requireAnyRole = (roles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!roles.includes(user.role)) {
      return res.status(403).send(`You don't have permission to access this resource`);
    }

    next();
  };
}