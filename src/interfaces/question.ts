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
    origin?: string;
}

export interface QuestionPushBody {
    sectionId: number;
    projectId: number;

    content?: string;
    weight?: number;
    orderInSection?: number;
    isRequired?: boolean;
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
    questionOptions?: Option[] | [];

    questionType?: string;
    isRequired?: boolean;
}

export interface QuestionDeleteBody {
    sectionId: number;
    projectId: number;
    questionInSectionId: number;
}

export interface SelectedQuestionContextProps {
    selectedQuestion: Question;
    setSelectedQuestion: (question: Question) => void;
}

export interface IsChangedQuestionContextProps {
    isChanged: boolean;
    isFetching: boolean;
    setIsChanged: (isChanged: boolean) => void;
    refetch: () => void;
}