
export interface IWorkspace {
    id: string;
    name?: string;
    description?: string;
    createdAt?: Date | string;
    deleteAt?: Date | string;
    ownerId?: string;
    background?: string;
    icon?: string;
    isPersonal?: boolean;
    isDeleted?: boolean;
}

export interface IRecentlyWorkspace extends IWorkspace {
    openedAt?: string;
    isHided?: boolean;
    isPinned?: boolean;
}