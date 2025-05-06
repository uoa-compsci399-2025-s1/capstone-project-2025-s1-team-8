import { CreateFormResponseData, CreateFormData } from '@/types/Collections'
import { QuestionResponse } from '@/types/Form'
import { FormQuestion, FormResponse } from '@/payload-types'
import { mockClient1 } from './User.mock'
import { CreateFormQuestionData, UpdateFormQuestionData } from '@/types/Collections'

/*
 * The FormQuestion mocks
 */

export const formQuestionMock: FormQuestion = {
  id: '67ff38a56a35e1b6cf43a681',
  question: 'What do you want out of this project?',
  description: 'E.g. Hello',
  order: 0,
  required: true,
  fieldName: 'project_needs',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const formQuestionCreateMock: CreateFormQuestionData = {
  question: 'What is your name?',
  description: 'E.g. Jeffery',
  order: 1,
  required: true,
  fieldName: 'name',
}
export const formQuestionUpdateMock: UpdateFormQuestionData = {
  question: 'What is your age?',
  description: 'E.g. 12',
  order: 2,
  required: true,
  fieldName: 'age',
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
  client: mockClient1,
  otherClients: [mockClient1],
  questionResponses: [questionResponseMock],
}

export const formResponseMock: FormResponse = {
  id: '67ff38a56a35e1b6cf43a681',
  name: 'Form Response Mock',
  description: 'Form Response Description Mock',
  client: mockClient1,
  otherClients: [mockClient1],
  questionResponses: [questionResponseMock],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

/*
 * Form mocks
 */

export const formMock: CreateFormData = {
  name: 'Form Mock',
  description: 'Form Description Mock',
}
