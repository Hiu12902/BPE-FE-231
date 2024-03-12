import { useMutation } from "@tanstack/react-query";
import { questionApi } from "../api";
import { QuestionDeleteBody, QuestionPushBody, QuestionUpdateBody, UseMutation } from "../interfaces";
import useNotification from "./useNotification";

export const useUpdateQuestionMutation = ({
    onSuccess,
    onSettled,
}: UseMutation) => {
    return useMutation({
        mutationFn: (data: QuestionUpdateBody) => questionApi.updateQuestion(data),
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
}

export const useDeleteQuestionMutation = ({
    onSuccess,
    onSettled,
}: UseMutation) => {
    return useMutation({
        mutationFn: (data: QuestionDeleteBody) => questionApi.deleteQuestion(data),
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
}

export const useCreateQuestionMutation = ({
    onSuccess,
    onSettled
}: UseMutation) => {
    return useMutation({
        mutationFn: (data: QuestionPushBody) => questionApi.createQuestion(data),
        onSuccess: (data: QuestionPushBody) => onSuccess?.(data),
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