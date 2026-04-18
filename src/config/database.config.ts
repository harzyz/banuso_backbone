// src/config/database.config.ts
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const url = configService.get<string>('DATABASE_URL') ?? '';
  const cleanUrl = url.replace(/[?&]sslmode=[^&]*/g, '');

  return {
    type: 'postgres',
    url: cleanUrl,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: { rejectUnauthorized: false },
  };
};
