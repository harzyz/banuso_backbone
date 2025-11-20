// Seed script for creating the first admin
import { AppDataSource } from '../config/data-source';
import { Admin, AdminRole } from '../entities/admin.entity';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcrypt') as typeof import('bcrypt');

async function seedAdmin() {
  try {
    // Initialize data source connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connected');
    }

    const adminRepository = AppDataSource.getRepository(Admin);

    // Check if admin already exists
    const existingAdmin = await adminRepository.findOne({
      where: { email: 'admin@banuso.com' },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email: admin@banuso.com');
      await AppDataSource.destroy();
      return;
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash('Admin123!', 10);

    // Create admin
    const admin = adminRepository.create({
      email: 'admin@banuso.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    });

    await adminRepository.save(admin);
    console.log('✅ First admin created successfully!');
    console.log('📧 Email: admin@banuso.com');
    console.log('🔑 Password: Admin123!');
    console.log('⚠️  Please change the password after first login!');

    // Close connection
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

// Run the seed
void seedAdmin();
