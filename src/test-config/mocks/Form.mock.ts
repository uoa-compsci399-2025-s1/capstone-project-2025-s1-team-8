import { CreateFormResponseData, CreateFormData } from '@/types/Collections'
import { QuestionResponse } from '@/types/Form'
import { FormQuestion, FormResponse } from '@/payload-types'
import { CreateFormQuestionData, UpdateFormQuestionData } from '@/types/Collections'
import { clientMock } from './Auth.mock'

/*
 * The FormQuestion mocks
 */

export const formQuestionMock: FormQuestion = {
  id: '67ff38a56a35e1b6cf43a681',
  question: 'What do you want out of this project?',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const formQuestionCreateMock: CreateFormQuestionData = {
  question: 'What is your name?',
}

export const formQuestionUpdateMock: UpdateFormQuestionData = {
  question: 'What is your age?',
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
  clients: [clientMock],
  questionResponses: [questionResponseMock],
}

export const formResponseMock: FormResponse = {
  id: '67ff38a56a35e1b6cf43a681',
  name: 'Form Response Mock',
  description: 'Form Response Description Mock',
  clients: [clientMock],
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
  questions: [formQuestionMock],
}
