export interface PortfolioProject {
    id: number,
    name?: string,
    ownerName?: string,
}

export interface PortfolioProcess {
    id: number,
    name: string,
    lastSaved: string,
}

export interface PortfolioVersion {
    projectId: number,
    processId: number,
    version: string,
    isActive: boolean,
    health: null | number,
    strategicImportance: number,
    feasibility: number,
}