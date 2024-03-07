import { Question } from "./question";

export interface Section {
    sectionId: number;
    sectionName?: string;
    orderInSurvey?: number;
    questions: Question[];
}