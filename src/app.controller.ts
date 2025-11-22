import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Returns hello message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Use this endpoint to keep your Render service alive. Ping it every 5-10 minutes using a cron service like UptimeRobot or cron-job.org',
  })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: {
          type: 'string',
          example: '2024-01-01T00:00:00.000Z',
        },
        database: { type: 'string', example: 'connected' },
        uptime: { type: 'number', example: 3600 },
      },
    },
  })
  async getHealth() {
    return this.appService.getHealth();
  }
}
