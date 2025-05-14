import { AppDataSource } from '../config/typeorm.config';
import { UserEntity, UserRole } from '../entities/user.entity';

async function createEmployee() {
  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(UserEntity);

    const phone = process.argv[2];
    const password = process.argv[3];

    if (!phone || !password) {
      console.error('Usage: ts-node createEmployee.ts <phone> <password>');
      process.exit(1);
    }

    const existingUser = await userRepository.findOne({ where: { phone } });
    if (existingUser) {
      console.error('User with this phone number already exists');
      process.exit(1);
    }

    const employee = userRepository.create({
      phone,
      password,
      role: UserRole.EMPLOYEE,
      name: 'Employee',
      email: `${phone}@restaurant.com`,
    });

    await userRepository.save(employee);
    console.log('Employee created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating employee:', error);
    process.exit(1);
  }
}

createEmployee(); 