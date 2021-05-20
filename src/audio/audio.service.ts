import { Injectable } from '@nestjs/common';
import {SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason, CancellationDetails, CancellationReason, SpeechSynthesisOutputFormat, SpeechSynthesizer} from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';


@Injectable()
export class AudioService {

    subKey = process.env.COGNITIVE_SERVICES_KEY;
    region = process.env.COGNITIVE_SERVICES_REGION;
    speechConfig = SpeechConfig.fromSubscription(this.subKey, this.region);
    snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    
    async upload(file: Express.Multer.File): Promise<string>{
        let audioResult = '';
        let currentLoop = 0;
        let functionComplete = false;
        
        console.log(file.size);

        let audioConfig = AudioConfig.fromWavFileInput(file.buffer);
        let recognizer = new SpeechRecognizer(this.speechConfig, audioConfig);

        console.log("sending to Azure API")
        recognizer.recognizeOnceAsync(result => {
            console.log("inside the recognize function");
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
       while(!functionComplete && currentLoop < 10){
        await this.snooze(1000);
        currentLoop++;
    }
       console.log("done recognizing " + audioResult)
       return audioResult;
       
    }

    async convertTextToAudio(text :string): Promise<Blob>{
        this.speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
        this.speechConfig.speechSynthesisVoiceName = 'en-CA-LiamNeural';
        let currentLoop = 0;
        let functionComplete = false;
        let audioFile :Blob;
        const synthesizer = new SpeechSynthesizer(this.speechConfig);
        synthesizer.speakTextAsync(text, (result) => {
            console.log('inside the speakTextAsync')
            if (result){
                audioFile = new Blob([result.audioData], {type: 'audio/mpeg'});
                functionComplete = true;
                synthesizer.close();
                
            }
        },
        (err) => {
            console.log(err);
            synthesizer.close();
        })
        while(!functionComplete && currentLoop < 10){
            await this.snooze(1000);
            currentLoop++;
        }
        return audioFile;
    }
}
