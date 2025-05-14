export enum UserRole {
  GUEST = 'GUEST',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
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