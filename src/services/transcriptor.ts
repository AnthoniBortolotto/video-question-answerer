import axios from "axios";

export async function getTranscription(videoId: string){
    const url = process.env.TRANSCRIPTOR_URL;
    const axiosResponse = await axios.get<{
        transcription: string;
    }>(`${url}/${videoId}`);
    return axiosResponse.data.transcription;
}