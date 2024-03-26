import { useMutation, useQuery } from "@tanstack/react-query";
import { processportfolioApi } from "../api";
import { IQueryParams, PortfolioProcess, UseMutation } from "../interfaces";
import useNotification from "./useNotification";

export const usePortfolioProjectQuery = (
    params: IQueryParams,
) => {
    const queryParams = {
        ...params,
    }

    const queryKey = ['portfolio_projects', queryParams];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => processportfolioApi.getPortfolioProject({
            ...params,
        }),
        enabled: !!params.workspaceId,
        retry: 3,
    })
};

export const usePortfolioProcessQuery = ({
    workspaceId,
    projectId
}: {
    workspaceId: number,
    projectId: number,
}) => {
    const queryKey = ['portfolio_processes', {
        workspaceId,
        projectId,
    }];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => processportfolioApi.getPortfolioProcess({
            workspaceId,
            projectId,
        }),
        enabled: !!workspaceId && !!projectId,
        retry: 3,
    })
}

export const usePortfolioVersionQuery = ({
    workspaceId,
    processId
}: {
    workspaceId: number,
    processId: number,
}) => {
    const queryKey = ['portfolio_version', {
        workspaceId,
        processId,
    }];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => processportfolioApi.getPortfolioVersion({
            workspaceId,
            processId,
        }),
        enabled: !!workspaceId && !!processId,
        retry: 3,
    })
}

export const useActivateVersionMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: ({
            workspaceId,
            processVersionVersion
        }: {
            workspaceId: number,
            processVersionVersion: string,
        }) => processportfolioApi.activateVersion({
            workspaceId,
            processVersionVersion,
        }),
        onSuccess: (data: PortfolioProcess) => onSuccess?.(data),
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