import { InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

export async function getTranscription(videoId: string, language = 'pt') {
  const baseUrl = process.env.TRANSCRIPTOR_URL;
  const requestUrl = `${baseUrl}/${videoId}?lang=${language}`;

  const axiosResponse = await axios
    .get<{
      transcription: string;
    }>(requestUrl)
    .catch((err) => {
      console.log('erro', err);
      throw new InternalServerErrorException(
        'Erro ao acessar o serviço de transcrição',
      );
    });
  return axiosResponse.data.transcription;
}
