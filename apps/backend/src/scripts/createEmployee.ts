import { MongoDBConnection } from '../config/mongodb.config';
import { UserModel } from '../models/user.model';
import { UserRole } from '../types/user';
import bcrypt from 'bcryptjs';

async function createEmployee() {
  try {
    await MongoDBConnection.getInstance().connect();

    const phone = process.argv[2];
    const password = process.argv[3];

    if (!phone || !password) {
      console.error('Usage: ts-node createEmployee.ts <phone> <password>');
      process.exit(1);
    }

    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      console.error('User with this phone number already exists');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new UserModel({
      phone,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
      name: 'Employee',
      email: `${phone}@restaurant.com`,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await employee.save();
    console.log('Employee created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating employee:', error);
    process.exit(1);
  }
}

createEmployee(); 