import { Controller, Get } from '@nestjs/common';
import { ETLService } from './etl.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('ETL')
@Controller('etl')
export class ETLController {
  constructor(private readonly etlService: ETLService) {}

  @ApiOperation({ summary: 'Run the ETL process' })
  @ApiResponse({ status: 200, description: 'ETL process completed successfully.' })
  @ApiResponse({ status: 500, description: 'Failed to run the ETL process.' })
  @Get('run')
  async runETL() {
    // Adjust the path based on the environment
    const filePath = path.join(
      process.cwd(),
      process.env.NODE_ENV === 'production' ? 'dist' : 'src',
      'etl',
      'query2_ref.txt'
    );
    try {
      await this.etlService.runETL(filePath);
      return { message: 'ETL process completed' };
    } catch (error) {
      console.error('ETL process failed', error);
      throw new Error('ETL process failed');
    }
  }
}
