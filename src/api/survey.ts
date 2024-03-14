import Client from '@/api/client';
import { IQueryParams, Survey, SurveyGeneralConfiguration, SurveyInfo, SurveyPushBody, SurveyResponseConfiguration, SurveyUpdateBody } from '../interfaces';

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

    public getSurveyGeneralConfig(params: IQueryParams): Promise<SurveyGeneralConfiguration> {
        return Client.get(`/survey/general_configuration`, {
            params: {
                surveyId: params.surveyId,
                projectId: params.projectId,
            }
        })
    }

    public getSurveyResponseConfig(params: IQueryParams): Promise<SurveyResponseConfiguration> {
        return Client.get(`/survey/response_configuration`, {
            params: {
                surveyId: params.surveyId,
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

    public updateSurveyResponseConfiguration(data: SurveyUpdateBody): Promise<SurveyUpdateBody> {
        return Client.put(`/survey/response_configuration`, {
            surveyId: data.surveyId,
            projectId: data.projectId,
            startDate: data.startDate,
            endDate: data.endDate,
            incompleteSurveyAction: data.incompleteSurveyAction,
            allowDuplicateRespondent: data.allowDuplicateRespondent,
            sendResultToRespondent: data.sendResultToRespondent,
        })
    }
}

export default SurveyApi.instance;
