import { Injectable } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';
import axios from 'axios';

@Injectable()
export class ChatbotService {
    private chatbotUrl = process.env.CHATBOT_URL;

    /**
     * Sends a question to the chatbot to get a response.
     *
     * @param question the question
     * @returns a response to the question
     */
    public async getAnswer(question:string):Promise<string> {
        const data = JSON.stringify({
            "cat": "SCD_Knowledgebase",
            "inq": question,
            "rspCnt": 1
        });

        const config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        const robotResponse = await axios.post(this.chatbotUrl, data, config)
        const robotRpt:{[key:string]:any} = robotResponse.data;
        return this.santize(robotRpt.rptObjLst[0].pRsp);
    }

    /**
     * FAQ of question and answers.
     *
     * @returns the entire FAQ
     */
    public async getFaq():Promise<Map<string, string>> {
        const data = JSON.stringify({
            "op": "getFaqLst",
        });

        const config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        const robotResponse = await axios.post(this.chatbotUrl, data, config)
        const robotRpt:{[key:string]:any} = robotResponse.data.rptObjLst;
        const faqMap = new Map<string, string>();

        for (let key in robotRpt) {
            this.buildFAQ(robotRpt[key], faqMap);
            break;
        }

        return faqMap;
    }

    /**
     * Remove all HTML content.
     *
     * @param dirty the content with HTML
     * @returns a string with all HTML stripped.
     */
    private santize(dirty:string):string {
        return sanitizeHtml(dirty, {allowedTags: []});
    }

    /**
     * Build the FAQ.
     *
     * @param currentNode the current node
     * @param faqMap the running question and answer map.
     */
    private buildFAQ(currentNode:any, faqMap: Map<string, string>):void {
        if (currentNode.question) {
            // Need to handle links
            faqMap.set(currentNode.question, this.santize(JSON.parse(currentNode.answer).answer.default));
            return;
        }

        if (currentNode.childrenCat) {
            for (let key in currentNode.childrenCat) {
                this.buildFAQ(currentNode.childrenCat[key], faqMap);
            }
        }

        if (currentNode.children) {
            for (let key in currentNode.children) {
                this.buildFAQ(currentNode.children[key], faqMap);
            }
        }
    }

}