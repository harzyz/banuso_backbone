// src/config/data-source.ts
import { DataSource } from 'typeorm';
// Load .env file (used by TypeORM CLI, not NestJS)
// Using require for TypeORM CLI compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
require('dotenv').config();

const rawUrl = process.env.DATABASE_MIGRATION_URL ?? '';
const cleanUrl = rawUrl.replace(/[?&]sslmode=[^&]*/g, '');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: cleanUrl,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  ssl: { rejectUnauthorized: false },
});
