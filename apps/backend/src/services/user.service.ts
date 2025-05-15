import { User, UserModel } from '../models/user.model';
import { MongoDBConnection } from '../config/mongodb.config';
import { UserRole } from '../types/user';

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export class UserService {
  async initialize() {
    await MongoDBConnection.getInstance().connect();
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const user = new UserModel({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return UserModel.findOne({ phone }).exec();
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async deleteAllUsers(): Promise<void> {
    await UserModel.deleteMany({});
  }
} 