import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { UserRole } from '../types/user'; 
import { User } from '@/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userService = new UserService();
    await userService.initialize();
    
    const user = await userService.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (req.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}; 