import { useMutation, useQuery } from '@tanstack/react-query';
import { surveyApi } from '../api';
import { IQueryParams, SurveyPushBody, UseMutation } from '../interfaces';
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