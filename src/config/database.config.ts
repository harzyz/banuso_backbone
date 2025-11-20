// src/config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Pooled connection for app
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Use migrations instead - safer for production
  logging: process.env.NODE_ENV === 'development',
  ssl: { rejectUnauthorized: false }, // Always required for Supabase
});
