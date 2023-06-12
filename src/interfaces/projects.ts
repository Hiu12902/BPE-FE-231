import { UserRole } from '@/constants/project';
import { IUser } from './user';

export interface IFile {
  variant?: 'general' | 'result';
  name?: string;
  size?: number;
  lastSaved?: Date | string;
  version?: string;
  documentLink?: string;
  xmlFileLink?: string;
  projectId: number;
  projectName?: string;
  onDeleteFile?: (link?: string | number) => void;
  canDelete?: boolean;
  result?: any;
  description?: string;
  createAt?: string;
  id?: number;
  processId?: number;
  num?: number;
  processName?: string;
  role?: UserRole;
}

export interface IProject {
  disabled?: boolean;
  name?: string;
  owner?: IUser;
  size?: number;
  lastUpdated?: Date | string;
  createAt?: Date | string;
  id: number;
  files?: IFile[];
  onDeleteProject?: (projectId: number) => void;
  shouldGetDocuments?: boolean;
  processesCount?: number;
  role?: UserRole;
}

export interface IWorkspace {
  name: string;
  isOpenFromEditor?: boolean;
}

export interface IComment {
  id: number;
  createAt: string;
  content?: string;
  xmlFileLink?: string;
  projectId?: number;
  author?: {
    avatar?: string;
    email?: string;
    id?: number;
  };
  canDelete?: boolean;
  onDeleteComment?: (commentId: number) => void;
}
