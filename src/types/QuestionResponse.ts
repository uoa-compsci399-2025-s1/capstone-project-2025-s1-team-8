import { FormQuestion } from "@/payload-types";

export interface QuestionResponse {
    question: FormQuestion;
    answer: string;
}