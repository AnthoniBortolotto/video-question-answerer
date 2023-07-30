export default interface IAnswerQuestionBody {
    question: string;
    videoId?: string;
    lang?: string;
    receivedTranscription?: string;
}