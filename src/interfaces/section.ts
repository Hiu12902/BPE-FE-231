import { Question } from "./question";

export interface Section {
    sectionId: number;
    sectionName?: string;
    orderInSurvey?: number;
    questions: Question[];
}

export interface SectionInfo {
    id: number;
    sectionName: string;
    orderInSurvey: number;
}