export enum UserRole {
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
} 