import type { CreateFormData } from '@/types/Collections'
import type { QuestionResponse } from '@/types/Form'
import type { FormQuestion } from '@/payload-types'
import type { CreateFormQuestionData, UpdateFormQuestionData } from '@/types/Collections'

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
