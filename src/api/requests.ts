import Client from "@/api/client";

class RequestsApi {
    public static classInstance: RequestsApi;

    static get instance() {
        if (!this.classInstance) {
            this.classInstance = new RequestsApi();
        }

        return this.classInstance;
    }

    public getAllWorkspaceRequests(
        workspaceId: number,
        query?: {
            status?: string;
            keyword?: string;
            type?: string;
            page?: number;
        }
    ): Promise<any> {
        return Client.get(`/request`, {
            params: {
                workspaceId,
                ...query,
            },
        });
    }

    public sendRequest({
        workspaceId,
        type,
        senderId,
        recipientId,
        rcpPermission,
        toPermission,
        frPermission,
        content,
    }: {
        workspaceId: number;
        type: string;
        senderId: number;
        recipientId: number;
        content: string;
        rcpPermission?: string;
        toPermission?: string;
        frPermission?: string;
    }): Promise<any> {
        return Client.post(`/request`, {
            workspaceId: workspaceId?.toString(),
            requestType: type,
            content: content,
            senderId: senderId?.toString(),
            recipientId: recipientId?.toString(),
            rcpPermission: rcpPermission ? rcpPermission : null,
            to_permission: toPermission ? toPermission : null,
            fr_permission: frPermission ? frPermission : null,
        });
    }

    public deleteRequests({
        workspaceId, requestIdList
    }: {
        workspaceId: string, requestIdList: string[]
    }): Promise<any> {
        return Client.post(`/request/deletion`, {
            workspaceId: workspaceId,
            requestIdList: requestIdList
        });
    }

    public approveRequests({
        workspaceId,
        requestId,
        status,
    }: {
        workspaceId: string;
        requestId: string[];
        status: string;
    }): Promise<any> {
        return Client.post(``);
    }

    public declineRequests({
        workspaceId,
        requestId,
        status,
    }: {
        workspaceId: string;
        requestId: string[];
        status: string;
    }): Promise<any> {
        return Client.post(``);
    }
}

export default RequestsApi.instance;
