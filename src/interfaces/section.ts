import { Question } from "./question";

export interface Section {
    sectionId: number;
    sectionName?: number;
    orderInSurvey?: number;
    questions: Question[];
}