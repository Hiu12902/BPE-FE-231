export interface IFile {
  variant?: 'general' | 'result';
  name?: string;
  id: string;
  size?: number;
  lastUpdated?: Date | string;
}

export interface IProject {
  disabled?: boolean;
  name?: string;
  owner?: string;
  size?: number;
  lastUpdated?: Date | string;
  id: string;
  files?: IFile[];
}

export interface IWorkspace {
  name: string;
  projects: IProject[];
  id: string;
}
