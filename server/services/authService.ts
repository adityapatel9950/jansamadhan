import { userRepository } from "../repositories/userRepository.js";
import { RegisterDTO, LoginDTO, SafeUser } from "../types/user.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

export class AuthService {
  async register(
    data: RegisterDTO,
  ): Promise<{ user: SafeUser; token: string }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const passwordHash = hashPassword(data.password);
    const newUser = await userRepository.create({
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      role: data.role,
      phone: data.phone,
      organizationOrDepartment: data.organizationOrDepartment,
      district: data.district,
      designation: data.designation,
      passwordHash,
      isVerified: true,
      metadata: {},
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    return { user: newUser, token };
  }

  async login(data: LoginDTO): Promise<{ user: SafeUser; token: string }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Check password
    if (
      user.passwordHash &&
      !comparePassword(data.password, user.passwordHash)
    ) {
      throw new Error("Invalid email or password.");
    }

    const { passwordHash: _, ...safeUser } = user;

    const token = signToken({
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
      name: safeUser.name,
    });

    return { user: safeUser, token };
  }

  async getCurrentUser(userId: string): Promise<SafeUser | null> {
    return userRepository.findById(userId);
  }

  async getDemoAccounts(): Promise<SafeUser[]> {
    return userRepository.getDemoAccounts();
  }
}

export const authService = new AuthService();
