export const WorkspaceData: TRecentlyWorkspace[] = [
    {
        id: "1",
        name: "Workspace 1",
        description: "This is the first workspace",
        createdAt: "2021-01-01T00:00:00.000Z",
        ownerId: "1",
        background: "",
        icon: "",
        isPersonal: false,
        isDeleted: false,
        isPinned: false,
    },
    {
        id: "2",
        name: "Workspace 2",
        description: "This is the second workspace",
        createdAt: "2021-01-02T00:00:00.000Z",
        ownerId: "1",
        background: "",
        icon: "",
        isPersonal: true,
        isDeleted: false,
        isPinned: true,
    },
    {
        id: "3",
        name: "Workspace 3",
        description: "This is the second workspace",
        createdAt: "2021-01-02T00:00:00.000Z",
        ownerId: "1",
        background: "",
        icon: "",
        isPersonal: false,
        isDeleted: false,
        isPinned: true,
    }
];

export interface TWorkspace {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    deleteAt?: string;
    ownerId: string;
    background?: string;
    icon?: string;
    isPersonal: boolean;
    isDeleted: boolean;
}

export interface TRecentlyWorkspace extends TWorkspace {
    openedAt?: string;
    isHided?: boolean;
    isPinned?: boolean;
}