import { IUser } from './user';

export interface IFile {
  variant?: 'general' | 'result';
  name?: string;
  size?: number;
  lastSaved?: Date | string;
  version?: string;
  documentLink?: string;
  xmlFileLink?: string;
  projectId?: number;
  projectName?: string;
  onDeleteFile?: (link?: string) => void;
  canDelete?: boolean;
}

export interface IProject {
  disabled?: boolean;
  name?: string;
  owner?: string;
  size?: number;
  lastUpdated?: Date | string;
  createAt?: Date | string;
  id: number;
  files?: IFile[];
  onDeleteProject?: (projectId: number) => void;
  shouldGetDocuments?: boolean;
}

export interface IWorkspace {
  name: string;
  isOpenFromEditor?: boolean;
}

export interface IComment {
  id: number;
  createAt: string;
  content?: string;
  userId: number;
  xmlFileLink?: string;
  projectId?: number;
}
