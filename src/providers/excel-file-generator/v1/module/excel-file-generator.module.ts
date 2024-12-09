import { Module } from '@nestjs/common';
import { ExcelFileGeneratorService } from '../service/excel-file-generator.service';

@Module({
  providers: [ExcelFileGeneratorService],
  exports: [ExcelFileGeneratorService],
})
export class ExcelFileGeneratorModule {}
