export interface IWorkspace {
    id: number;
    name?: string;
    description?: string;
    createdAt?: Date | string;
    deleteAt?: Date | string;
    ownerId?: number;
    background?: string;
    icon?: string;
    isPersonal?: boolean;
    isDeleted?: boolean;
    openedAt?: string;
    isHided?: boolean;
    isPinned?: boolean;
}