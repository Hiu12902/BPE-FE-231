import { Section } from "./section";

export interface SurveyInfo {
    id: number;
    name: string;
    description: string;
    createdAt: Date | string;
    isDeleted: boolean;
    startDate: Date | string | null;
    endDate: Date | string | null;
    isPublished: boolean;
}

export interface Survey {
    survey: SurveyInfo;
    questions: Section[];
}

export interface SurveyPushBody {
    processVersionVersion: string;
    projectId: string;
}

export interface SurveyGeneralConfiguration extends SurveyInfo {
    npsWright: number;
    cesWeight: number;
    csatWeight: number;
}