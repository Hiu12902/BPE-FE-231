export interface AnswerDetailResult {
    value: string | number;
    numberOfAnswers: number;
    percentage: number;
}

export interface QuestionDetailResult {
    totalResponses: number;
    id: number;
    content: string;
    questionType: string;
    questionResponses: AnswerDetailResult[];
}

export interface SurveyTotalResult {
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

export interface SurveyResultInfo extends SurveyTotalResult {
    surveyId: number;
    questions: QuestionDetailResult[];
}