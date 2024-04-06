import Client from '@/api/client';
import { HealthPerformanceLevel, IQueryParams, NAVersion, PerformanceLevelUpdateBody, PortfolioProcess, PortfolioProject, PortfolioVersion, ProcessPortfolioPoint, ResponseObject, VersionMeasurements, VersionMeasurementsUpdateBody } from '../interfaces';

class ProcessPortfolioApi {
    public static classInstance: ProcessPortfolioApi;

    static get instance() {
        return !this.classInstance ? new ProcessPortfolioApi() : this.classInstance;
    }

    public getPortfolioProject(params: IQueryParams): Promise<ResponseObject<PortfolioProject>> {
        return Client.get(
            `/workspace/portfolio/projects`,
            {
                params: {
                    ...params,
                }
            }
        )
    }

    public getPortfolioProcess({
        workspaceId,
        projectId
    }: {
        workspaceId: number,
        projectId: number,
    }): Promise<PortfolioProcess[]> {
        return Client.get(
            `/workspace/portfolio/processes`,
            {
                params: {
                    workspaceId: workspaceId,
                    projectId: projectId,
                }
            }
        )
    }

    public getPortfolioVersion({
        workspaceId,
        processId
    }: {
        workspaceId: number,
        processId: number,
    }): Promise<PortfolioVersion[]> {
        return Client.get(
            `/workspace/portfolio/processversion`,
            {
                params: {
                    workspaceId: workspaceId,
                    processId: processId,
                }
            }
        )
    }

    public activateVersion({
        workspaceId,
        processId,
        processVersionVersion
    }: {
        workspaceId: number,
        processId: number,
        processVersionVersion: string,
    }): Promise<PortfolioProcess> {
        return Client.post(
            `/workspace/portfolio/processversion/activation`,
            {
                workspaceId: workspaceId,
                processId: processId,
                processVersionVersion: processVersionVersion,
            }
        )
    }

    public getPerformanceLevel({
        workspaceId,
    }: {
        workspaceId: number,
    }): Promise<HealthPerformanceLevel> {
        return Client.get(
            `/workspace/measurements`,
            {
                params: {
                    workspaceId: workspaceId,
                }
            }
        )
    }

    public updatePerformanceLevel(data: PerformanceLevelUpdateBody): Promise<HealthPerformanceLevel> {
        return Client.put(
            `/workspace/measurements`,
            data
        )
    }

    public getVersionMeasurements({
        workspaceId,
        processVersionVersion
    }: {
        workspaceId: number,
        processVersionVersion: string,
    }): Promise<VersionMeasurements> {
        return Client.get(
            `/workspace/portfolio/processversion/measurements`,
            {
                params: {
                    workspaceId: workspaceId,
                    processVersionVersion: processVersionVersion,
                }
            }
        )
    }

    public updateVersionMeasurements(data: VersionMeasurementsUpdateBody): Promise<VersionMeasurements> {
        return Client.post(
            `/workspace/portfolio/processversion/measurements`,
            data
        )
    }

    public getNotAvailableVersionMeasurements(params: IQueryParams): Promise<ResponseObject<NAVersion>> {
        return Client.get(
            `/workspace/portfolio/processversion/notavailable`,
            {
                params: {
                    ...params,
                }
            }
        )
    }

    public getProcessPortfolio(workspaceId: number): Promise<{
        processPortfolio: ProcessPortfolioPoint[]
    }> {
        return Client.get(
            `/workspace/portfolio`,
            {
                params: {
                    workspaceId: workspaceId,
                }
            }
        )
    }
}

export default ProcessPortfolioApi.instance;
