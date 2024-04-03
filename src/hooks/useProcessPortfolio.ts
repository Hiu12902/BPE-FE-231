import { useMutation, useQuery } from "@tanstack/react-query";
import { processportfolioApi } from "../api";
import { IQueryParams, PerformanceLevelUpdateBody, PortfolioProcess, UseMutation, VersionMeasurementsUpdateBody } from "../interfaces";
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
            processId,
            processVersionVersion
        }: {
            workspaceId: number,
            processId: number,
            processVersionVersion: string,
        }) => processportfolioApi.activateVersion({
            workspaceId,
            processId,
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

export const usePerformanceLevelQuery = ({
    workspaceId
}: {
    workspaceId: number,
}) => {

    const queryKey = ['performance_level', workspaceId];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => processportfolioApi.getPerformanceLevel({
            workspaceId: workspaceId
        }),
        enabled: !!workspaceId,
        retry: 3,
    })
};

export const usePerformanceLevelMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (data: PerformanceLevelUpdateBody) => processportfolioApi.updatePerformanceLevel(data),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useVersionMeasurementsQuery = ({
    workspaceId,
    processVersionVersion
}: {
    workspaceId: number,
    processVersionVersion: string,
}) => {
    const queryKey = ['version_measurements', {
        workspaceId,
        processVersionVersion,
    }];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => processportfolioApi.getVersionMeasurements({
            workspaceId,
            processVersionVersion,
        }),
        enabled: !!workspaceId && !!processVersionVersion,
        retry: 3,
    })
}

export const useVersionMeasurementsMutation = ({ onSuccess, onSettled }: UseMutation) => {
    return useMutation({
        mutationFn: (data: VersionMeasurementsUpdateBody) => processportfolioApi.updateVersionMeasurements(data),
        onSuccess: (data: any) => onSuccess?.(data),
        onError: (err: any) => {
            const notify = useNotification();
            notify({
                title: 'Error',
                message: err,
                type: 'error',
            });
        },
        onSettled: () => onSettled?.(),
    })
}

export const useNAVersionMeasurementsQuery = (params: IQueryParams) => {
    const queryKey = ['not_available_version', {
        ...params,
    }];

    return useQuery({
        queryKey: queryKey,
        queryFn: () => processportfolioApi.getNotAvailableVersionMeasurements({
            ...params,
        }),
        enabled: !!params.workspaceId,
        retry: 3,
    })
}