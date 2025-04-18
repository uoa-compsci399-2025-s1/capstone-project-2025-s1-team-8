import { CreateFormResponseData, CreateFormData } from '@/types/Collections'
import { QuestionResponse } from '@/types/Form'
import { FormQuestion } from '@/payload-types'
import { mockClient1 } from './User.mock'

/*
 * The FormQuestion mocks
 */

export const formQuestionMock: FormQuestion = {
  id: '67ff38a56a35e1b6cf43a681',
  question: 'What do you want out of this project?',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

/*
 * QuestionResponse mocks
 */

export const questionResponseMock: QuestionResponse = {
  question: formQuestionMock,
  answer: 'Would be good to have a MVP done by blah blah...',
}

/*
 * FormResponse mocks
 */

export const formResponseCreateMock: CreateFormResponseData = {
  name: 'AI girlfriend finder',
  description: 'AI girlfriend finder is a cool project to find your perfect match!',
  clients: [mockClient1],
  questionResponses: [questionResponseMock],
}

/*
 * Form mocks
 */

export const formMock: CreateFormData = {
  name: 'Form Mock',
  description: 'Form Description Mock',
  questions: [formQuestionMock],
}
