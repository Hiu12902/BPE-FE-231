import Client from '@/api/client';
import { IQueryParams, Survey, SurveyInfo, SurveyPushBody } from '../interfaces';

class SurveyApi {
    public static classInstance: SurveyApi;

    static get instance() {
        return !this.classInstance ? new SurveyApi() : this.classInstance;
    }

    public createSurvey(data: SurveyPushBody): Promise<Survey> {
        return Client.post(`/survey`, {
            processVersionVersion: data.processVersionVersion,
            projectId: data.projectId,
        });
    }

    public getQuestionInSurvey(params: IQueryParams): Promise<Survey> {
        return Client.get(`/survey/edit`, {
            params: {
                processVersionVersion: params.processVersion,
                projectId: params.projectId,
            }
        });
    }
}

export default SurveyApi.instance;
