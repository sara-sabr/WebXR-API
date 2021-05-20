import { Injectable } from '@nestjs/common';
import {SpeechConfig, AudioConfig, AudioInputStream, SpeechRecognizer, ResultReason, CancellationDetails, CancellationReason, SpeechSynthesisOutputFormat, SpeechSynthesizer, AudioOutputStream, NoMatchDetails} from 'microsoft-cognitiveservices-speech-sdk';
import { PassThrough } from 'stream';
import { createReadStream } from 'fs';


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

        //let audioConfig = AudioConfig.fromWavFileInput(file.buffer);

        let pushStream = AudioInputStream.createPushStream();

        createReadStream('').on('data', function(arrayBuffer: ArrayBuffer) {
            pushStream.write(arrayBuffer.slice(0));
            console.log(arrayBuffer.slice(0).byteLength);
        }).on('end', function() {
            pushStream.close();
        });
        console.log(pushStream);
        let audioConfig = AudioConfig.fromStreamInput(pushStream);
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
    async convertTextToAudio(text :string){
        this.speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;
        this.speechConfig.speechSynthesisVoiceName = 'en-CA-LiamNeural';

        const synthesizer = new SpeechSynthesizer(this.speechConfig, undefined);
        let a = synthesizer.speakTextAsync(text, (result) => {
            synthesizer.close();
            if (result){
                const { audioData } = result;

                synthesizer.close();
                const bufferStream = new PassThrough();
                bufferStream.end(Buffer.from(audioData));
                return bufferStream;
            }
        },
        (err) => {
            console.log(err);
            synthesizer.close();
        })

        return a;
    }
}
