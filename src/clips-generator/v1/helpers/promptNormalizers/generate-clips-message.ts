import { ChatCompletionMessageParam } from 'openai/resources';
import { IClipsDetailsParams } from '../../interfaces/clips-details-params.interface';
import { InternalServerErrorException, Logger } from '@nestjs/common';

export function generateClipsMessage(
  transcription: string,
  clipDetails: IClipsDetailsParams,
): ChatCompletionMessageParam[] {
  try {
    let prompt = `you are a system that generates youtube podcast video clips, you will receive a transcription of the dialogues in the folowing format: "hh:mm:ss - hh:mm:ss: bla bla bla; hh:mm:ss - hh:mm:ss: bla bla bla; ...". You must generate clips of the video with the dialogues with the time of the video that the clip start and end in the following format: "hh:mm:ss - hh:mm:ss: title; hh:mm:ss - hh:mm:ss: title; ...", try to generate sensasionalist titles to attract more views`;
    if (clipDetails.maxClipDuration && clipDetails.minClipDuration) {
      prompt += `, keep the clips duration between ${clipDetails.minClipDuration} and ${clipDetails.maxClipDuration} minutes and do not generate clips with more or less duration than that`;
    } else if (clipDetails.maxClipDuration) {
      prompt += `, keep the clips duration below ${clipDetails.maxClipDuration} minutes and do not generate clips with more duration than that`;
    } else if (clipDetails.minClipDuration) {
      prompt += `, keep the clips duration above ${clipDetails.minClipDuration} minutes and do not generate clips with less duration than that`;
    }

    if (clipDetails.maxClips && clipDetails.minClips) {
      prompt += `, generate between ${clipDetails.minClips} and ${clipDetails.maxClips} clips`;
    } else if (clipDetails.maxClips) {
      prompt += `, generate up to ${clipDetails.maxClips} clips and do not generate more than that`;
    } else if (clipDetails.minClips) {
      prompt += `, generate at least ${clipDetails.minClips} clips and do not generate less than that`;
    }

    prompt += `. The video dialogues are in ${clipDetails.lang || 'en'} and the title must be in the same language`;

    return [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: transcription,
      },
    ];
  } catch (error) {
    Logger.error('error on generateClipsMessage', error);
    throw new InternalServerErrorException();
  }
}
