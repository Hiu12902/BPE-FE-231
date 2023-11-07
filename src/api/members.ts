import Client from "@/api/client";

class MembersApi {
    public static classInstance: MembersApi;

    static get instance() {
        if (!this.classInstance) {
            this.classInstance = new MembersApi();
        }

        return this.classInstance;
    }

    public getAllWorkspaceMembers(
        workspaceId: number,
        query?: {
            perrmission?: string;
            keyword?: string;
            page?: number;
        }): Promise<any> {
        return Client.get(`/workspace/${workspaceId}/members`, {
            params: {
                ...query
            }
        });
    }

    public inviteUserToWorkspace({ workspaceId, memberId, permission }: { workspaceId: string, memberId: string, permission: string }): Promise<any> {
        return Client.post(`/workspace/members`, {
            memberId: memberId,
            workspaceId: workspaceId,
            permission: permission
        });
    }

    public changeSelectedMembersPermission({ workspaceId, memberIdList, permission }: { workspaceId: string, memberIdList: string[], permission: string }): Promise<any> {
        return Client.post(`/workspace/members/permission`, {
            workspaceId: workspaceId,
            permission: permission,
            memberIdList: memberIdList
        });
    }

    public deleteMembers({ workspaceId, memberIdList }: { workspaceId: string, memberIdList: string[] }): Promise<any> {
        return Client.post(`/workspace/members/deletion`, {
            workspaceId: workspaceId,
            memberIdList: memberIdList
        });
    }
}

export default MembersApi.instance;
