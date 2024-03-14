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
    message?: string;
    survey: SurveyInfo;
    questions: Section[];
}

export interface SurveyPushBody {
    processVersionVersion: string;
    projectId: number;
}

export interface SurveyUpdateBody {
    surveyId: number;
    projectId: number;
    name?: string;
    description?: string;
    npsWeight?: number;
    cesWeight?: number;
    csatWeight?: number;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    incompleteSurveyAction?: string;
    allowDuplicateRespondent?: boolean;
    sendResultToRespondent?: boolean;
}

export interface SurveyGeneralConfiguration extends SurveyInfo {
    npsWeight: number;
    cesWeight: number;
    csatWeight: number;
}

export interface SurveyResponseConfiguration extends SurveyInfo {
    incompleteSurveyAction: string;
    allowDuplicateRespondent: boolean;
    sendResultToRespondent: boolean;
}