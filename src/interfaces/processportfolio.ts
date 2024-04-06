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
    num: number,
}

export interface HealthPerformanceLevel {
    targetedCycleTime: number,
    worstCycleTime: number | null,

    targetedCost: number,
    worstCost: number | null,

    targetedQuality: number,
    worstQuality: number,

    targetedFlexibility: number,
    worstFlexibility: number,
}

export interface PerformanceLevelUpdateBody extends HealthPerformanceLevel {
    workspaceId: number,
}

export interface VersionMeasurements {
    health: {
        currentCycleTime: number,
        currentCost: number,
        currentQuality: number,
        currentFlexibility: number,
    },
    strategicImportance: number,
    feasibility: number,
    evaluationResult: {
        totalCycleTime: number,
        totalCost: number,
        totalQuality: number,
        totalFlexibility: number,
    }
}

export interface VersionMeasurementsUpdateBody {
    workspaceId: number,
    processVersionVersion: string,

    currentCycleTime?: number,
    currentCost?: number,
    currentQuality?: number,
    currentFlexibility?: number,

    strategicImportance?: number,
    feasibility?: number,
}

export interface NAVersion {
    processVersionVersion: string,
    processName: string,
    processId: number,
    projectId: number,
    num: number,

    feasibility: number,
    strategicImportance: number,
    health: number,
}

export interface ProcessPortfolioPoint {
    processName: string,
    projectName: string,
    processVersionVersion: string,
    num: number,

    feasibility: number,
    strategicImportance: number,
    health: number,
}