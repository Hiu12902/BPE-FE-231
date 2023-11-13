export interface IWorkspace {
    id: number;
    name?: string;
    description?: string;
    createdAt?: Date | string;
    openedAt?: string;
    ownerId?: number;
    ownerAvatar?: string;
    ownerName?: string;
    ownerEmail?: string;
    permission?: string;
    background?: string;
    icon?: string;
    isPersonal?: boolean;
    isDeleted?: boolean;
    isHided?: boolean;
    isPinned?: boolean;
    offset: number; // USED FOR KEEPING ORDER OF WORKSPACES FROM RETURNED FROM BE
}

export interface IMembers {
    name?: string;
    email?: string;
    avatar?: string;
    memberId: number;
    workspaceId?: number;
    joinedAt?: string;
    permission?: string;
    offset: number; // USED FOR KEEPING ORDER OF MEMBERS FROM RETURNED FROM BE
}

export interface IRequests {
    id: number;
    content?: string;
    createdAt?: string;
    frPermission?: string;
    toPermission?: string;
    rcpPermission?: string;
    handlerId?: number;
    recipientId?: number;
    senderId?: number;
    status?: string;
    type?: string;
    workspaceId?: number;
    offset: number; // USED FOR KEEPING ORDER OF MEMBERS FROM RETURNED FROM BE
}