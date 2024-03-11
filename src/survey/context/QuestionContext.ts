import { IsChangedQuestionContextProps, Question, SelectedQuestionContextProps } from '@/interfaces/index';
import { createContext } from 'react';

export const SelectedQuestionContext = createContext<SelectedQuestionContextProps>({
    selectedQuestion: {} as Question,
    setSelectedQuestion: () => { },
});

export const IsChangedQuestionContext = createContext<IsChangedQuestionContextProps>({
    isChanged: false,
    setIsChanged: () => { },
    refetch: () => { },
})