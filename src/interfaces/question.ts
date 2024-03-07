import { Option } from './option'

export interface Question {
    id: number;
    content?: string;
    isDeleted?: boolean;
    isRequired?: boolean;
    orderInSection?: number;
    weight?: number;
    questionType?: string;
    questionOptions: Option[] | [];
}

export interface SelectedQuestionContextProps {
    selectedQuestion: Question;
    setSelectedQuestion: (question: Question) => void;
}

export interface IsChangedQuestionContextProps {
    isChanged: boolean;
    setIsChanged: (isChanged: boolean) => void;
}