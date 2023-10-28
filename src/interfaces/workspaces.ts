export interface IWorkspace {
    id: number;
    name?: string;
    description?: string;
    createdAt?: Date | string;
    deleteAt?: Date | string;
    ownerId?: number;
    ownerAvatar?: string;
    ownerName?: string;
    ownerEmail?: string;
    background?: string;
    icon?: string;
    isPersonal?: boolean;
    isDeleted?: boolean;
    openedAt?: string;
    isHided?: boolean;
    isPinned?: boolean;
    offset: number; // USED FOR KEEPING ORDER OF WORKSPACES FROM REUTRNED FROM BE
}