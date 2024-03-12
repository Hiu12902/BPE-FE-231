import Client from '@/api/client';
import { Question, QuestionDeleteBody, QuestionPushBody, QuestionUpdateBody } from '../interfaces';

class QuestionApi {
    public static classInstance: QuestionApi;

    static get instance() {
        return !this.classInstance ? new QuestionApi() : this.classInstance;
    }

    public createQuestion(data: QuestionPushBody): Promise<QuestionPushBody> {
        return Client.post(`/survey/question`, {
            sectionId: data.sectionId,
            projectId: data.projectId,
            content: data.content,
            weight: data.weight,
            orderInSection: data.orderInSection,
            isRequired: data.isRequired,
            questionType: data.questionType,
            questionOptions: data.questionOptions,
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

    public deleteQuestion(data: QuestionDeleteBody): Promise<any> {
        return Client.delete(`/survey/question`, {
            data: {
                sectionId: data.sectionId,
                projectId: data.projectId,
                questionInSectionId: data.questionInSectionId
            }
        });
    }
}

export default QuestionApi.instance;
