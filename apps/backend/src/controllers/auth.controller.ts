import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserRole } from '../types/user';
import bcrypt from 'bcryptjs';
const dotenv = require('dotenv').config();
const JWT_SECRET = dotenv.parsed?.JWT_SECRET || 'your-secret-key';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async verify(req: Request, res: Response) {
    try {
      // @ts-ignore
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      return res.json({
        valid: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone } = req.body;

      if (!email || !password || !name || !phone) {
        return res.status(400).json({ message: 'Email, password, name, and phone are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone format' });
      }

      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userService.createUser({
        email,
        password: hashedPassword,
        name,
        phone,
        role: UserRole.GUEST,
      });

      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({ message: 'Phone and password are required' });
      }

      const user = await this.userService.findByPhone(phone);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
} 