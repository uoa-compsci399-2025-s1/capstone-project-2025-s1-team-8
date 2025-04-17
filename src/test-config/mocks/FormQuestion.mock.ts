import { FormQuestion } from '@/payload-types'
import { CreateFormQuestionData, UpdateFormQuestionData } from '@/types/Collections'

export const formQuestionCreateMock: CreateFormQuestionData = {
  question: 'What is your name?',
}
export const formQuestionUpdateMock: UpdateFormQuestionData = {
  question: 'What is your age?',
}
export const formQuestionMock: FormQuestion = {
  id: '67ff38a56a35e1b6cf43a68b',
  question: 'What is your name?',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}