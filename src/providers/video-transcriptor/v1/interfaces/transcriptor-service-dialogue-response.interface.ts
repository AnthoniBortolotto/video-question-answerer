export interface ITranscriptorServiceDialogueResponse {
    dialogues: {
        start: number;
        end: number;
        text: string;
    }[];
}