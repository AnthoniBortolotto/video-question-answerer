import axios from 'axios';

export async function getTranscription(videoId: string, language = 'pt') {
  const baseUrl = process.env.TRANSCRIPTOR_URL;
  const requestUrl = `${baseUrl}/${videoId}?lang=${language}`;
  const teste = await axios
    .get(`${baseUrl}/`, {
      proxy: false,
    })
    .catch((err) => {
      console.log('erro', err);
      throw new Error('Erro ao acessar o serviço de transcrição');
    });
  console.log('teste', teste.data);
  console.log('api', requestUrl);
  const axiosResponse = await axios.get<{
    transcription: string;
  }>(requestUrl);
  console.log('foi');
  return axiosResponse.data.transcription;
}
