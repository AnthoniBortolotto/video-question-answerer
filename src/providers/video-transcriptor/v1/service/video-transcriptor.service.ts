import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import { ITranscriptorServiceDialogueResponse } from '../interfaces/transcriptor-service-dialogue-response.interface';

import { ITranscriptorServiceTextResponse } from '../interfaces/transcriptor-service-text-response.interface';

@Injectable()
export class VideoTranscriptorService {
  async getTranscriptionDialogues(videoId: string, language = 'en'): Promise<ITranscriptorServiceDialogueResponse> {
    const baseUrl = `${process.env.TRANSCRIPTOR_URL}/dialogues`;
    const requestUrl = `${baseUrl}/${videoId}?lang=${language}`;
    const axiosResponse = await axios.get<ITranscriptorServiceDialogueResponse>(requestUrl).catch((err) => {
      Logger.error('error on getTranscriptionDialogues', err, err.response?.data);
      throw new InternalServerErrorException('Error on accessing transcription service');
    });
    return axiosResponse.data;
  }

  async getTranscriptionText(videoId: string, language = 'en'): Promise<string> {
    const baseUrl = `${process.env.TRANSCRIPTOR_URL}/text`;
    const requestUrl = `${baseUrl}/${videoId}?lang=${language}`;
    const axiosResponse = await axios.get<ITranscriptorServiceTextResponse>(requestUrl).catch((err) => {
      Logger.error('error on getTranscriptionText ', err, err.response?.data);
      throw new InternalServerErrorException('Error on accessing transcription service');
    });
    return axiosResponse.data.transcription;
  }

  normalizeTranscriptionDialogues(
    transcription: ITranscriptorServiceDialogueResponse,
    videoStart: Date,
    videoEnd?: Date,
  ): string[] {
    try {
      const transcriptionDialogues = new Array<string>();
      for (const currentItem of transcription.dialogues) {
        const start = new Date(currentItem.start * 1000);
        const end = new Date(currentItem.end * 1000);
        if (videoStart > start) {
          continue;
        }
        if (videoEnd && videoEnd < end) {
          break;
        }
        const formattedStart = start.toISOString().substring(11, 19);
        const formattedEnd = end.toISOString().substring(11, 19);
        transcriptionDialogues.push(`${formattedStart} : ${formattedEnd} - ${currentItem.text}`);
      }

      return transcriptionDialogues;
    } catch (error) {
      Logger.error('error on normalizeTranscriptionDialogues ', error);
      throw new InternalServerErrorException();
    }
  }
}
