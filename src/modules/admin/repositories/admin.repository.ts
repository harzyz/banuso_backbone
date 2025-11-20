import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminRole } from '../../../entities/admin.entity';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(adminData: Partial<Admin>): Promise<Admin> {
    const admin = this.adminRepository.create(adminData);
    return await this.adminRepository.save(admin);
  }

  async findById(id: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'role',
        'isActive',
        'profilePicture',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    role?: AdminRole;
  }): Promise<{ admins: Admin[]; total: number }> {
    const { page = 1, limit = 10, role } = options || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    if (role) {
      queryBuilder.where('admin.role = :role', { role });
    }

    const [admins, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('admin.createdAt', 'DESC')
      .getManyAndCount();

    return { admins, total };
  }

  async update(id: string, updateData: Partial<Admin>): Promise<Admin> {
    await this.adminRepository.update(id, updateData);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Admin not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.adminRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.adminRepository.count({
      where: { email },
    });
    return count > 0;
  }
}
