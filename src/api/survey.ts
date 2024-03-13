import Client from '@/api/client';
import { IQueryParams, Survey, SurveyInfo, SurveyPushBody, SurveyUpdateBody } from '../interfaces';

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

    public getSurveyInformation(params: IQueryParams): Promise<SurveyInfo> {
        return Client.get(`/survey`, {
            params: {
                processVersionVersion: params.processVersionVersion,
                projectId: params.projectId,
            }
        })
    }

    public deleteSurvey(params: IQueryParams): Promise<any> {
        return Client.delete(`/survey`, {
            params: {
                surveyId: params.surveyId,
                projectId: params.projectId
            }
        })
    }

    public updateSurveyGeneralConfiguration(data: SurveyUpdateBody): Promise<SurveyUpdateBody> {
        return Client.put(`/survey/general_configuration`, {
            surveyId: data.surveyId,
            projectId: data.projectId,
            name: data.name,
            description: data.description,
            npsWarnings: data.npsWeight,
            cesWeight: data.cesWeight,
            csatWeight: data.csatWeight,
        })
    }
}

export default SurveyApi.instance;
