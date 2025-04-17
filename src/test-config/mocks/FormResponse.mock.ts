import { CreateFormResponseData } from '@/types/Collections'
import { QuestionResponse } from '@/types/Form'
import { formQuestionMock } from './FormQuestion.mock'
import { mockClient1 } from './User.mock'

export const questionResponseMock: QuestionResponse = {
  question: formQuestionMock,
  answer: 'Would be good to have a MVP done by blah blah...',
}

export const formResponseCreateMock: CreateFormResponseData = {
  name: 'AI girlfriend finder',
  description: 'AI girlfriend finder is a cool project to find your perfect match!',
  clients: [mockClient1],
  questionResponses: [questionResponseMock],
}
