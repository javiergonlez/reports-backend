//--------------------------------------------------------------------------------------------------------------------

import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { S3Service } from './s3.service';
import type { CsvFiles, S3DataErrorResponse, S3DataResponse } from 'src/types';

//--------------------------------------------------------------------------------------------------------------------

@Controller('dashboard')
class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Auth()
  @Get('data')
  async getS3DataAsJson(): Promise<S3DataResponse | S3DataErrorResponse> {
    try {
      const data: CsvFiles = await this.s3Service.loadAllCsvsFromS3();
      const files: string[] = Object.keys(data);

      return {
        message: 'S3 data loaded successfully',
        files,
        data,
      };
    } catch (error) {
      return {
        message: 'Error loading S3 data',
        error: (error as Error).message,
      };
    }
  }
}

export { S3Controller };
