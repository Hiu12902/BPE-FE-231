import Client from '@/api/client';
import { Question, QuestionPushBody, QuestionUpdateBody } from '../interfaces';

class QuestionApi {
    public static classInstance: QuestionApi;

    static get instance() {
        return !this.classInstance ? new QuestionApi() : this.classInstance;
    }

    public createQuestion(data: QuestionPushBody): Promise<Question> {
        return Client.post(`/question`, {
            content: data.content,
            weight: data.weight,
            orderInSection: data.orderInSection,
            questionOptions: data.questionOptions,
            questionType: data.questionType,
            isRequired: data.isRequired
        });
    }

    public updateQuestion(data: QuestionUpdateBody): Promise<Question> {
        return Client.put(`/survey/question`, {
            sectionId: data.sectionId,
            projectId: data.projectId,
            questionInSectionId: data.questionInSectionId,
            content: data.content,
            weight: data.weight,
            orderInSection: data.orderInSection,
            questionOptions: data.questionOptions,
            questionType: data.questionType,
            isRequired: data.isRequired
        });
    }
}

export default QuestionApi.instance;
