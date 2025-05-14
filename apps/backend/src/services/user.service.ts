import { DataSource } from 'typeorm';
import { UserEntity, UserRole } from '../entities/user.entity';

interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export class UserService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: 'reservations.db',
      synchronize: true,
      logging: true,
      entities: [UserEntity],
    });
  }

  async initialize() {
    await this.dataSource.initialize();
  }

  async createUser(input: CreateUserInput): Promise<UserEntity> {
    const repository = this.dataSource.getRepository(UserEntity);
    const user = repository.create({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return repository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const repository = this.dataSource.getRepository(UserEntity);
    return repository.findOneBy({ email });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const repository = this.dataSource.getRepository(UserEntity);
    return repository.findOneBy({ id });
  }


  async findByPhone(phone: string): Promise<UserEntity | null> {
    const repository = this.dataSource.getRepository(UserEntity);
    return repository.findOneBy({ phone });
  }

  async updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const repository = this.dataSource.getRepository(UserEntity);
    await repository.update(id, {
      ...data,
      updatedAt: new Date(),
    });
    return repository.findOneByOrFail({ id });
  }
} 