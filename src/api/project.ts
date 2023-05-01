import Client from '@/api/client';

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
}

export default ProjectApi.instance;
