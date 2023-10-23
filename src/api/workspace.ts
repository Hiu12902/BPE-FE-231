import Client from "@/api/client";

class WorkspaceApi {
    public static classInstance: WorkspaceApi;

    static get instance() {
        if (!this.classInstance) {
            this.classInstance = new WorkspaceApi();
        }

        return this.classInstance;
    }

    public getAllWorkspaces(): Promise<any> {
        return Client.get("/workspace/me/all");
    }

    public getPinnedWorkspaces(): Promise<any> {
        return Client.get("/workspace/me/pinned");
    }

    public createWorkspace({
        name,
        description,
    }: {
        name: string;
        description: string;
    }): Promise<any> {
        return Client.post("/workspace", { name, description });
    }

    public deleteWorkspace(workspaceId: number): Promise<any> {
        return Client.post("/workspace/deletion", { workspaceId: workspaceId });
    }

    public updateWorkspaceName({ workspaceId, name }: { workspaceId: number, name: string }): Promise<any> {
        return Client.post("/workspace/nameupdation", { workspaceId, name });
    }

    public updateWorkspaceDescription({ workspaceId, description }: { workspaceId: number, description: string }): Promise<any> {
        return Client.post("/workspace/descriptionupdation", { workspaceId, description });
    }

    public updateWorkspace({
        workspaceId,
        name,
        description,
    }: {
        workspaceId: number,
        name?: string,
        description?: string,
    }): Promise<any> {
        return Client.put("/workspace", { workspaceId, name, description });
    }

    public pinWorkspace(workspaceId: number): Promise<any> {
        return Client.post("/workspace/pinned", { workspaceId });
    }

    public searchWorkspace(searchValue: string): Promise<any> {
        return Client.get(`/workspace/search/${searchValue}`);
    }
}

export default WorkspaceApi.instance;
