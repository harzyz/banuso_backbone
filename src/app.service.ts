import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getHealth(): Promise<{
    status: string;
    timestamp: string;
    database: string;
    uptime: number;
  }> {
    let databaseStatus = 'disconnected';
    try {
      const isConnected = this.dataSource.isInitialized;
      if (isConnected) {
        // Try to run a simple query to verify database is actually working
        await this.dataSource.query('SELECT 1');
        databaseStatus = 'connected';
      }
    } catch (error) {
      databaseStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      uptime: process.uptime(),
    };
  }
}
