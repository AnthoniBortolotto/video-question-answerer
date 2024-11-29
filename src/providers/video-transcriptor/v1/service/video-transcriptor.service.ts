import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ITranscriptorServiceDialogueResponse } from '../interfaces/transcriptor-service-dialogue-response.interface';

import { ITranscriptorServiceTextResponse } from '../interfaces/transcriptor-service-text-response.interface';

@Injectable()
export class VideoTranscriptorService {
  /**
   * Get the transcription from the transcriptor service as an object with the video dialogues
   * @param videoId the video id to get the transcription
   * @param language the language to get the transcription
   * @returns the transcription object with the dialogues from the video
   */
  async getTranscriptionDialogues(
    videoId: string,
    language = 'en',
  ): Promise<ITranscriptorServiceDialogueResponse> {
    const baseUrl = `${process.env.TRANSCRIPTOR_URL}/dialogues`;
    const requestUrl = `${baseUrl}/${videoId}?lang=${language}`;
    const axiosResponse = await axios
      .get<ITranscriptorServiceDialogueResponse>(requestUrl)
      .catch((err) => {
        console.log('erro', err);
        throw new InternalServerErrorException(
          'Error on accessing transcription service',
        );
      });
    return axiosResponse.data;
  }
  /**
   * Get the transcription from the transcriptor service as a string
   * @param videoId the video id to get the transcription
   * @param language the language to get the transcription
   * @returns the transcription text from the video as a string
   */
  async getTranscriptionText(
    videoId: string,
    language = 'en',
  ): Promise<string> {
    const baseUrl = `${process.env.TRANSCRIPTOR_URL}/text`;
    const requestUrl = `${baseUrl}/${videoId}?lang=${language}`;
    const axiosResponse = await axios
      .get<ITranscriptorServiceTextResponse>(requestUrl)
      .catch((err) => {
        console.log('erro', err);
        throw new InternalServerErrorException(
          'Error on accessing transcription service',
        );
      });
    return axiosResponse.data.transcription;
  }
  /**
   * Normalize the transcription to be sent to the openai service
   * @param transcription the response from the transcriptor service
   * @returns a formatted transcription with the interval and text
   * @description format the transcription to be sent to the openai service, can cause a bug if the video is longer than 24 hours, but openai limit will be reached before that
   */
  normalizeTranscriptionDialogues(
    transcription: ITranscriptorServiceDialogueResponse,
  ): string[] {
    // for test purposes, we are only getting the first 2000 dialogues
    return transcription.dialogues.map((dialogue) => {
      const formattedStart = new Date(dialogue.start * 1000)
        .toISOString()
        .substring(11, 19);
      const formattedEnd = new Date(dialogue.end * 1000)
        .toISOString()
        .substring(11, 19);
      return `${formattedStart}: ${dialogue.text}`;
    }).slice(0, 2000);
  }
}
