import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "../data/models/user.model";

interface IDecodedToken {
  userId: string;
  role: string;
  email: string;
}

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as IDecodedToken;

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

export const requireVerifiedEmail = (req: any, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user.verified) {
    return res.status(400).send('Email address not verified');
  }

  next();
}

export const decodeJwtToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.sub);

    if (!user) {
      return next();
    }
    req.user = user;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
  next();
}

export const requireAuth = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send(`You're not authorized to access this resource`);
  }
  next();
}


