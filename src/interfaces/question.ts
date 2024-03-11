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

export interface QuestionPushBody {
    content?: string;
    isDeleted?: boolean;
    isRequired?: boolean;
    orderInSection?: number;
    weight?: number;
    questionType?: string;
    questionOptions: Option[] | [];
}

export interface QuestionUpdateBody {
    sectionId: number;
    projectId: number;
    questionInSectionId: number;

    content?: string;
    weight?: number;
    orderInSection?: number;
    questionOptions: Option[] | [];

    questionType?: string;
    isRequired?: boolean;
}

export interface SelectedQuestionContextProps {
    selectedQuestion: Question;
    setSelectedQuestion: (question: Question) => void;
}

export interface IsChangedQuestionContextProps {
    isChanged: boolean;
    setIsChanged: (isChanged: boolean) => void;
    refetch: () => void;
}