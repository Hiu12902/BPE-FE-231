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