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
   * @param videoStart the start of the video to get the transcription
   * @param videoEnd the end of the video, if not provided will get the whole transcription
   * @returns a formatted transcription with the interval and text between the start and end of the video
   * @description format the transcription to be sent to the openai service, can cause a bug if the video is longer than 24 hours, but openai limit will be reached before that
   */
  normalizeTranscriptionDialogues(
    transcription: ITranscriptorServiceDialogueResponse,
    videoStart = '00:00:00',
    videoEnd?: string,
  ): string[] {
    const videoStartDate = new Date(`1970-01-01Z${videoStart}`);
    const videoEndDate = videoEnd && new Date(`1970-01-01Z${videoEnd}`);

    const transcriptionDialogues = new Array<string>();
    for (const currentItem of transcription.dialogues) {
      const start = new Date(currentItem.start * 1000);
      const end = new Date(currentItem.end * 1000);
      if (videoStartDate > start) {
        continue;
      }
      if (videoEndDate && videoEndDate < end) {
        break;
      }
      const formattedStart = start.toISOString().substring(11, 19);
      const formattedEnd = end.toISOString().substring(11, 19);
      transcriptionDialogues.push(
        `${formattedStart} : ${formattedEnd} - ${currentItem.text}`,
      );
    }

    return transcriptionDialogues;
  }
}
