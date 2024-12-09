import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelFileGeneratorService {
  constructor() {}

  generateSingleSheetExcelFileBuffer(objects: Array<Object>, options?: XLSX.JSON2SheetOpts): Buffer {
    try {
      const workSheet = XLSX.utils.json_to_sheet(objects, options);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
      const excelFile = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
      return excelFile;
    } catch (error) {
      Logger.error('error on generateSingleSheetExcelFileBuffer in ExcelFileGeneratorService', error);
      throw new InternalServerErrorException();
    }
  }
}
