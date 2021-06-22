import { Injectable } from '@nestjs/common';
import {SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason, CancellationDetails, CancellationReason, SpeechSynthesisOutputFormat, SpeechSynthesizer} from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';


@Injectable()
export class AudioService {

    subKey = process.env.COGNITIVE_SERVICES_KEY;
    region = process.env.COGNITIVE_SERVICES_REGION;
    speechConfig = SpeechConfig.fromSubscription(this.subKey, this.region);
    snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

    async speechToText(file: Express.Multer.File): Promise<string>{
        let audioResult = '';
        let currentLoop = 0;
        let functionComplete = false;

        let audioConfig = AudioConfig.fromWavFileInput(file.buffer);
        let recognizer = new SpeechRecognizer(this.speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(result => {
            switch (result.reason) {
                case ResultReason.RecognizedSpeech:
                    console.log(`RECOGNIZED: Text=${result.text}`);
                    audioResult = result.text;
                    break;
                case ResultReason.NoMatch:
                    console.log("NOMATCH: Speech could not be recognized.");
                    break;
                case ResultReason.Canceled:
                    const cancellation = CancellationDetails.fromResult(result);
                    console.log(`CANCELED: Reason=${cancellation.reason}`);

                    if (cancellation.reason == CancellationReason.Error) {
                        console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                        console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                        console.log("CANCELED: Did you update the subscription info?");
                    }
                    break;
                }
            functionComplete = true;
            recognizer.close();
       }, err => {
           console.log(err);
           functionComplete = true;
       })
       while(!functionComplete && currentLoop < 70){
        await this.snooze(150);
        currentLoop++;
    }

       return audioResult;
    }

    async convertTextToAudio(text :string): Promise<PassThrough>{
        this.speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
        this.speechConfig.speechSynthesisVoiceName = 'en-CA-LiamNeural';
        let currentLoop = 0;
        let functionComplete = false;
        let bufferStream:PassThrough;
        const synthesizer = new SpeechSynthesizer(this.speechConfig);
        synthesizer.speakTextAsync(text, (result) => {
            if (result){
                const { audioData } = result;
                functionComplete = true;
                synthesizer.close();
                bufferStream = new PassThrough();
                bufferStream.end(Buffer.from(audioData));
            }
        },
        (err) => {
            console.log(err);
            synthesizer.close();
        })
        while(!functionComplete && currentLoop < 70){
            await this.snooze(150);
            currentLoop++;
        }
        return bufferStream;
    }
}
