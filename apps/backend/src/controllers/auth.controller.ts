import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import { UserRole } from '../entities/user.entity';
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
      // The requireAuth middleware already verified the token and attached the user
      // We just need to return the user data
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      return res.json({
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // Validate phone format (basic validation)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Invalid phone format' });
      }

      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      const user = await this.userService.createUser({
        email,
        password,
        name,
        phone,
        role: UserRole.GUEST,
      });

      const token = jwt.sign(
        { userId: user.id},
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        token,
        user: {
          id: user.id,
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

      const validPassword = await user.validatePassword(password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id},
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
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