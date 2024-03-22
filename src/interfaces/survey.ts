import { ResponseSubmission } from "./response";
import { Section } from "./section";

export interface SurveyInfo {
    id: number;
    name: string;
    description: string;
    createdAt: Date | string;
    isDeleted: boolean;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
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

export interface SurveySubmissionBody {
    processVersionVersion: string;
    email: string;
    fullName: string;
    answers: ResponseSubmission[];
}

export interface SurveySubmissionResponse {
    responseId: number;
    message: string;
    incompleteSurveyAction?: string;
    allowDuplicateRespondent?: boolean;
    sendResultToRespondent?: boolean;
}

export interface ISurveyResult {
    numberOfResponses: number;
    ces: {
        score: number;
        weight: number;
        numOfPositiveAnswers: number;
    }
    nps: {
        score: number;
        weight: number;
        numOfPromoters: number;
        numOfDetractors: number;
    }
    csat: {
        score: number;
        weight: number;
        numOfPositiveAnswers: number;
    }
    totalScore: number;
}

export interface SurveyGeneralConfiguration extends SurveyInfo {
    npsWeight: number;
    cesWeight: number;
    csatWeight: number;
}

export interface SurveyResponseConfiguration extends SurveyInfo {
    incompleteSurveyAction?: string;
    allowDuplicateRespondent?: boolean;
    sendResultToRespondent?: boolean;
}

export interface SurveyPublishBody {
    projectId: number;
    processVersionVersion: string;
    email: string[];
    surveyUrl: string;
    startDate: null | Date | string;
    endDate: null | Date | string;
}

export interface SurveyPublishResponse {
    id: number;
    isPublished: boolean;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    surveyUrl: string;
}