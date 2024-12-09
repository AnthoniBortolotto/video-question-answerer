import { InternalServerErrorException, Logger } from '@nestjs/common';

export class ClipsExcelRowModel {
  'Clip Name': string;
  'Clip Start': string;
  'Clip End': string;
  constructor(clipText: string) {
    try {
      const clipTextSplited = clipText.split(`"`);
      this['Clip Name'] = clipTextSplited[1];
      const clipTimeSplited = clipTextSplited[0].split(' - ');
      this['Clip Start'] = clipTimeSplited[0]?.trim();
      this['Clip End'] = clipTimeSplited[1]?.trim();
      if (this['Clip End'].endsWith(':')) {
        this['Clip End'] = this['Clip End'].slice(0, -1);
      }
    } catch (error) {
      Logger.error('error on ClipsExcelRowModel constructor', error);
      throw new InternalServerErrorException();
    }
  }
}
