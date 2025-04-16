import { CreateFormData } from '@/types/Collections'
import { FormQuestion } from '@/payload-types'
import { formQuestionMock } from '@/test-config/mocks/FormQuestion.mock'
import { semesterProjectMock } from '@/test-config/mocks/SemesterProject.mock'

export const formMock: CreateFormData = {
  name: 'Form Mock',
  description: 'Form Description Mock',
  questions: [formQuestionMock],
}
