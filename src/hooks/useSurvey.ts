import { useMutation, useQuery } from '@tanstack/react-query';
import { surveyApi } from '../api';
import { IQueryParams, SurveyPublishBody, SurveyPublishResponse, SurveyPushBody, SurveyResponseConfiguration, SurveySubmissionBody, SurveyUpdateBody, UseMutation } from '../interfaces';
import useNotification from './useNotification';

export const useSurvey = (
    params: IQueryParams,
) => {
    const queryParams = {
        ...params,
    }

    const queryKey = ['survey', queryParams];

    const questionInSurveyQuery = useQuery({
        queryKey: queryKey,
        queryFn: () => surveyApi.getQuestionInSurvey({
            ...params,
        }),
    })

    return {
        ...questionInSurveyQuery,
    }
};

export const useSurveyGeneralConfigQuery = (params: IQueryParams) => {
    const queryParams = {
        ...params,
    }

    const queryKey = ['survey_general_configuration', queryParams];

    const surveyGeneralConfigQuery = useQuery({
        queryKey: queryKey,
        queryFn: () => surveyApi.getSurveyGeneralConfig({
            ...params,
        }),
    })

    return {
        ...surveyGeneralConfigQuery,
    }
}

export const useSurveyResponseConfigQuery = (params: IQueryParams) => {
    const queryParams = {
        ...params,
    }

    const queryKey = ['survey_response_configuration', queryParams];

    const surveyResponseConfigQuery = useQuery({
        queryKey: queryKey,
        queryFn: () => surveyApi.getSurveyResponseConfig({
            ...params,
        }),
    })

    return {
        ...surveyResponseConfigQuery,
    }
}

export const useSurveyInformationQuery = (params: IQueryParams) => {
    const queryParams = {
        ...params,
    }

    const queryKey = ['survey_information', queryParams];

    const surveyInformationQuery = useQuery({
        queryKey: queryKey,
        queryFn: () => surveyApi.getSurveyInformation({
            ...params,
        }),
    })

    return {
        ...surveyInformationQuery,
    }
}

export const useCreateSurveyMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (data: SurveyPushBody) => surveyApi.createSurvey(data),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err.message,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    });
};

export const useUpdateSurveyGeneralConfigurationMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (data: SurveyUpdateBody) => surveyApi.updateSurveyGeneralConfiguration(data),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err.message,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useUpdateSurveyResponseConfigurationMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (data: SurveyUpdateBody) => surveyApi.updateSurveyResponseConfiguration(data),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err.message,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useDeleteSurveyMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (params: IQueryParams) => surveyApi.deleteSurvey(params),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err.message,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useSurveySubmissionMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (params: SurveySubmissionBody) => surveyApi.createSurveySubmission(params),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err.message,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useSurveySubmissionQuery = ({
    processVersionVersion,
    responseId
}: {
    processVersionVersion: string;
    responseId: number;
}) => {
    return useQuery({
        queryKey: ['survey_submission', processVersionVersion, responseId],
        queryFn: () => surveyApi.getSurveySubmissions({
            processVersionVersion,
            responseId,
        }),
        enabled: !!responseId,
    })
}

export const useSurveyResultQuery = ({
    processVersion
}: {
    processVersion: string;
}) => {
    return useQuery({
        queryKey: ['survey_result', processVersion],
        queryFn: () => surveyApi.getSurveyResult({
            processVersion,
        }),
        enabled: !!processVersion,
    })
}

export const useSurveyPublishMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (params: SurveyPublishBody) => surveyApi.publishSurvey(params),
        onSuccess: (data: SurveyPublishResponse) => onSuccess?.(data),
        onError: (err) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: "Something wrong happened during publishing, please try again later!",
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useCloseSurveyMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: ({ processVersionVersion, projectId }: {
            processVersionVersion?: string,
            projectId?: number
        }) => surveyApi.closeSurvey({ processVersionVersion, projectId }),
        onSuccess: (data: SurveyResponseConfiguration) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err.message,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const usePublishInfoQuery = ({
    processVersion,
    projectId
}: {
    processVersion?: string;
    projectId: number;
}) => {
    return useQuery({
        queryKey: ['survey_publish_info', processVersion, projectId],
        queryFn: () => surveyApi.getPublishInfo({
            processVersionVersion: processVersion,
            projectId: projectId,
        }),
        enabled: !!processVersion && !!projectId,
    })
}