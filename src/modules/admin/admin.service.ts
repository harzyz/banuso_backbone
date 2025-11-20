import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminRepository } from './repositories/admin.repository';
import { Admin, AdminRole } from '../../entities/admin.entity';
import { LoginAdminDto } from './dto/login-admin.dto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt') as typeof import('bcrypt');

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(adminData: Partial<Admin>): Promise<Admin> {
    // Check if email already exists
    const exists = await this.adminRepository.existsByEmail(adminData.email!);
    if (exists) {
      throw new Error('Admin with this email already exists');
    }

    // Hash password before saving
    if (adminData.password) {
      adminData.password = await bcrypt.hash(adminData.password, 10);
    }

    return await this.adminRepository.create(adminData);
  }

  async login(
    loginDto: LoginAdminDto,
  ): Promise<{ accessToken: string; admin: Partial<Admin> }> {
    // Find admin by email
    const admin = await this.adminRepository.findByEmail(loginDto.email);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const accessToken = await this.jwtService.signAsync(payload);

    // Return token and admin info (without password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...adminWithoutPassword } = admin;
    return {
      accessToken: accessToken as string,
      admin: adminWithoutPassword,
    };
  }

  async findById(id: string): Promise<Admin | null> {
    return await this.adminRepository.findById(id);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findByEmail(email);
  }

  async findAll(options?: { page?: number; limit?: number; role?: AdminRole }) {
    return await this.adminRepository.findAll(options);
  }

  async update(id: string, updateData: Partial<Admin>): Promise<Admin> {
    return await this.adminRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    return await this.adminRepository.delete(id);
  }
}
