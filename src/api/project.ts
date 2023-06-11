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

  public getProcessesByProject(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/process`);
  }

  public getProjectDocument(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/document`);
  }

  public getProcessVerions(payload: { projectId: number; processId: number }): Promise<any> {
    const { projectId, processId } = payload;
    return Client.get(`/project/${projectId}/process/${processId}/version`);
  }

  public getBpmnFileContent(query: {
    projectId: number;
    version: string;
    processId: number;
  }): Promise<any> {
    const { projectId, version, processId } = query;
    return Client.get(`/project/${projectId}/process/${processId}/version/${version}`);
  }

  public autosaveBpmnFiles(body: FormData): Promise<any> {
    return Client.put(`autosave/file`, body);
  }

  public saveBpmnFile(
    query: { projectId: number; version: string; processId: number },
    body: FormData
  ): Promise<any> {
    const { projectId, version, processId } = query;
    return Client.put(`/project/${projectId}/process/${processId}/version/${version}`, body);
  }

  public deleteVerion(query: {
    projectId: number;
    version: string;
    processId: number;
  }): Promise<any> {
    const { projectId, version, processId } = query;
    return Client.delete(`/project/${projectId}/process/${processId}/version/${version}`);
  }

  public renameProject(query: { projectId: number }, body: { name: string }) {
    const { projectId } = query;
    return Client.put(`/project/${projectId}/name`, body);
  }

  public createNewVersion(
    query: { projectId: number; processId: number },
    body: FormData
  ): Promise<any> {
    const { projectId, processId } = query;
    return Client.post(`/project/${projectId}/process/${processId}/version`, body);
  }

  public deleteProject(projectId: number): Promise<any> {
    return Client.delete(`/project/${projectId}`);
  }

  public getDocument(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/document`);
  }

  public getDocumentContent(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/document/text`);
  }

  public saveDocument(query: { projectId: number }, body: FormData): Promise<any> {
    const { projectId } = query;
    return Client.put(`/project/${projectId}/document/text`, body);
  }

  public getProjectMembers(projectId: number): Promise<any> {
    return Client.get(`/project/${projectId}/user`);
  }

  public getModelsComments(query: {
    projectID: string;
    version: string;
    processID: number;
  }): Promise<any> {
    return Client.get(`/comment?${queryString.stringify(query)}`);
  }

  public comment(body: {
    projectID: string;
    version: string;
    content: string;
    processID: number;
  }): Promise<any> {
    return Client.post(`/comment`, body);
  }

  public saveResult(body: {
    project_id: number;
    process_id: number;
    version: string;
    name?: string;
    result: any;
  }): Promise<any> {
    return Client.post(`/result/save`, body);
  }

  public deleteComment(body: { projectID: number; version: string; id: number }): Promise<any> {
    return Client.delete(`/bpmnfile/comment/delete`, { data: { ...body } });
  }

  public renameProcess(
    body: { name: string },
    query: { projectId: number; processId: number }
  ): Promise<any> {
    const { projectId, processId } = query;
    return Client.put(`/project/${projectId}/process/${processId}`, body);
  }

  public getResults(query: {
    projectID: number;
    version: string;
    processID: number;
  }): Promise<any> {
    return Client.get(`/result/all?${queryString.stringify(query)}`);
  }

  public shareProject(body: { user_id: number; role: UserRole }[], projectId: number) {
    return Client.post(`/project/${projectId}/user`, body);
  }

  public createNewProcess(query: { projectId: number }, body: { name: string }): Promise<any> {
    const { projectId } = query;
    return Client.post(`/project/${projectId}/process`, body);
  }

  public deleteProcess(query: { projectId: number; processId: number }): Promise<any> {
    const { projectId, processId } = query;
    return Client.delete(`/project/${projectId}/process/${processId}`);
  }

  public getHistoryImages(query: {
    projectID: number;
    processID: number;
    version: string;
  }): Promise<any> {
    return Client.get(`/image?${queryString.stringify(query)}`);
  }

  public autoSaveImages(body: FormData): Promise<any> {
    return Client.post(`/autosave/image`, body);
  }

  public saveImage(body: FormData): Promise<any> {
    return Client.post(`/image`, body);
  }
}

export default ProjectApi.instance;
