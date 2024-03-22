import Client from '@/api/client';
import { IQueryParams, ISurveyResult, Section, SectionInfo, Survey, SurveyGeneralConfiguration, SurveyInfo, SurveyPublishBody, SurveyPublishResponse, SurveyPushBody, SurveyResponseConfiguration, SurveySubmissionBody, SurveySubmissionResponse, SurveyUpdateBody } from '../interfaces';

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

    public getSectionInSurvey(props: { processVersion: string, mode: string }): Promise<{
        survey: SurveyInfo,
        sections: SectionInfo[],
    }> {
        return Client.get(`/survey/section/all`, {
            params: {
                processVersionVersion: props.processVersion,
                mode: props.mode,
            }
        })
    }

    public getQuestionInSection(props: { sectionId: number }): Promise<Section> {
        return Client.get(`/survey/section`, {
            params: {
                sectionId: props.sectionId
            }
        })
    }

    public createSurveySubmission(props: SurveySubmissionBody): Promise<SurveySubmissionResponse> {
        const {
            processVersionVersion,
            email,
            fullName,
            answers,
        } = props;
        return Client.post(`/survey/submission`, {
            processVersionVersion: processVersionVersion,
            email: email,
            fullName: fullName,
            answers: answers,
        });
    }

    public getSurveySubmissions({
        processVersionVersion,
        responseId
    }: {
        processVersionVersion: string;
        responseId: number;
    }): Promise<any> {
        return Client.get(`/survey/response`, {
            params: {
                processVersionVersion: processVersionVersion,
                responseId: responseId,
            }
        })
    }

    public getSurveyResult({
        processVersion
    }: {
        processVersion: string;
    }): Promise<ISurveyResult> {
        return Client.get(`/survey/result`, {
            params: {
                processVersionVersion: processVersion,
            }
        })
    }

    public publishSurvey(data: SurveyPublishBody): Promise<SurveyPublishResponse> {
        return Client.post(`/survey/publish`, {
            projectId: data.projectId,
            processVersionVersion: data.processVersionVersion,
            email: data.email,
            surveyUrl: data.surveyUrl,
            startDate: data.startDate,
            endDate: data.endDate,
        })
    }

    public closeSurvey({ processVersionVersion, projectId }: {
        processVersionVersion?: string,
        projectId?: number
    }): Promise<SurveyResponseConfiguration> {
        return Client.post(`/survey/publish/close`, {
            processVersionVersion: processVersionVersion,
            projectId: projectId,
        })
    }
}

export default SurveyApi.instance;
