import Client from '@/api/client';
import { UserRole } from '@/constants/project';
import queryString from 'query-string';

class ProjectApi {
  public static classInstance: ProjectApi;

  static get instance() {
    if (!this.classInstance) {
      this.classInstance = new ProjectApi();
    }

    return this.classInstance;
  }

  public getAllProjects(): Promise<any> {
    return Client.get('/project/all');
  }

  public createNewProject(projectName: string): Promise<any> {
    return Client.post('/project', { name: projectName });
  }

  public getProjectDocument(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/document`);
  }

  public getBpmnFilesOfProject(projectId: number): Promise<any> {
    return Client.get(`/bpmnfile/${projectId}`);
  }

  public getBpmnFileContent(query: { projectId: number; version: string }): Promise<any> {
    const { projectId, version } = query;
    return Client.get(`/bpmnfile/${projectId}/${version}/text`);
  }

  public saveBpmnFile(query: { projectId: number; version: string }, body: FormData): Promise<any> {
    const { projectId, version } = query;
    return Client.put(`/bpmnfile/${projectId}/${version}/save`, body);
  }

  public deleteBpmnFile(query: { projectId: number; version: string }): Promise<any> {
    const { projectId, version } = query;
    return Client.delete(`/bpmnfile/${projectId}/${version}/delete`);
  }

  public renameProject(query: { projectId: number }, body: { name: string }) {
    const { projectId } = query;
    return Client.put(`/project/${projectId}/name`, body);
  }

  public createNewVersion(query: { projectId: number }, body: FormData): Promise<any> {
    const { projectId } = query;
    return Client.post(`/bpmnfile/${projectId}/create`, body);
  }

  public deleteProject(projectId: number): Promise<any> {
    return Client.delete(`/project/${projectId}/delete`);
  }

  public getDocument(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/document`);
  }

  public getDocumentContent(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/document/text`);
  }

  public saveDocument(query: { projectId: number }, body: FormData): Promise<any> {
    const { projectId } = query;
    return Client.put(`/project/${projectId}/document/update`, body);
  }

  public getProjectMembers(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/user`);
  }

  public getModelsComments(query: { projectID: string; version: string }): Promise<any> {
    return Client.get(`/bpmnfile/comment?${queryString.stringify(query)}`);
  }

  public comment(body: { projectID: string; version: string; content: string }): Promise<any> {
    return Client.post(`/bpmnfile/comment/add`, body);
  }

  public saveResult(body: {
    projectID: number;
    version: string;
    name?: string;
    result: any;
  }): Promise<any> {
    const { projectID } = body;
    return Client.post(`/result/${projectID}/save`, body);
  }

  public deleteComment(body: { projectID: number; version: string; id: number }): Promise<any> {
    return Client.delete(`/bpmnfile/comment/delete`, { data: { ...body } });
  }

  public renameFile(
    body: { name: string },
    query: { projectId: number; version: string }
  ): Promise<any> {
    const { projectId, version } = query;
    return Client.put(`/bpmnfile/${projectId}/${version}/name`, body);
  }

  public getResults(query: { projectID: number; version: string }): Promise<any> {
    return Client.get(`/result/all?${queryString.stringify(query)}`);
  }

  public shareProject(body: { user_id: number; role: UserRole }[], projectId: number) {
    return Client.post(`/project/${projectId}/user/grant`, body);
  }
}

export default ProjectApi.instance;
