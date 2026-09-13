import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db/database';
import { config } from '../../config';
import { RegisterInput, LoginInput } from './auth.schemas';
import { User } from '../../types';

export class AuthService {
  public static async register(data: RegisterInput): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const existing = db.findUserByEmail(data.email);
    if (existing) {
      throw new Error('El correo electrónico ya está registrado en el sistema.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    // Create default split config
    db.splitConfigs.push({
      id: `split-${newUser.id}`,
      userId: newUser.id,
      carPercentage: 50,
      employeeAPercentage: 25,
      employeeBPercentage: 25,
      updatedAt: new Date().toISOString(),
    });

    db.saveToDisk();

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  public static async login(data: LoginInput): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = db.findUserByEmail(data.email);
    if (!user) {
      throw new Error('Credenciales inválidas. Verifique su correo y contraseña.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Credenciales inválidas. Verifique su correo y contraseña.');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  public static getMe(userId: string): Omit<User, 'passwordHash'> {
    const user = db.findUserById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
