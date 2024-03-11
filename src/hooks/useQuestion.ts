import { useMutation } from "@tanstack/react-query";
import { QuestionUpdateBody, UseMutation } from "../interfaces";
import { questionApi } from "../api";
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