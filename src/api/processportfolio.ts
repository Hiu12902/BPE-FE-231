import Client from '@/api/client';
import { PortfolioProcess, PortfolioProject, PortfolioVersion } from '@/interfaces/processportfolio';
import { IQueryParams, ResponseObject } from '../interfaces';

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
}

export default ProcessPortfolioApi.instance;
