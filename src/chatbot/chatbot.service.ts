import { Injectable } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';
import axios from 'axios';

@Injectable()
export class ChatbotService {
    /** End point URL */
    private chatbotUrl = process.env.CHATBOT_URL;
    /** The organization */
    private chatbotOrg = process.env.CHATBOT_ORG;
    /** The category */
    private chatbotCat = process.env.CHATBOT_CAT;
    /** FAQ cache */
    private faqCache: Map<String,any> = undefined;

    /**
     * Sends a question to the chatbot to get a response.
     *
     * @param question the question
     * @returns a response to the question
     */
    public async getAnswer(question:string):Promise<string> {
        const data = JSON.stringify({
            "orgId": this.chatbotOrg,
            "cat": this.chatbotCat,
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

        let chatbotAnswer = this.santize(robotRpt.rptObjLst[0].pRsp);

        if (chatbotAnswer === '') {
            // Follow the indicator till we get an answer from the FAQ.
            chatbotAnswer = await this.findAnswerFromCache(robotRpt.rptObjLst[0].pInq);
            chatbotAnswer = chatbotAnswer.replace(/\<li\>/g, '\n- ');
            chatbotAnswer = this.santize(chatbotAnswer);
        }

        return chatbotAnswer;
    }

    /**
     * Find an answer from the FAQ cache. If it isn't loaded, load it first.
     *
     * @param indicator the indicator to lookup.
     */
    public async findAnswerFromCache(indicator: string):Promise<string> {
        if (this.faqCache === undefined) {
            await this.refreshFaq();
        }

        return this.findAnswerFromCacheHelper(indicator);
    }

    /**
     * Find the answer from the cache by following the tree.
     */
    private findAnswerFromCacheHelper(indicator: string):string {
        let currentAnswer = this.faqCache.get(indicator);

        while (currentAnswer.answer && currentAnswer.answer.default === '') {
            currentAnswer = this.faqCache.get(currentAnswer.loadRsp.qName);
        }

        return currentAnswer.answer.default;
    }

    /**
     * Refresh the cache from the chatbot.
     */
    public async refreshFaq():Promise<void> {
        this.faqCache = await this.getFaq();
    }

    /**
     * FAQ of question and answers.
     *
     * @returns the entire FAQ
     */
    public async getFaq():Promise<Map<string, any>> {
        const data = JSON.stringify({
            "op": "getFaqLst",
            "orgId": this.chatbotOrg,
        });

        const config = {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        const robotResponse = await axios.post(this.chatbotUrl, data, config)
        const robotRpt:{[key:string]:any} = robotResponse.data.rptObjLst;
        const faqMap = new Map<string, any>();

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
    private buildFAQ(currentNode:any, faqMap: Map<string, any>):void {
        if (currentNode.question) {
            // Need to handle links
            faqMap.set(currentNode.question, JSON.parse(currentNode.answer));
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