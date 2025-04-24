import { describe, it, expect } from 'vitest'
import { CreateProjectRequestBody, CreateSemesterProjectRequestBody } from './ProjectRequests'
import {
  projectCreateMock,
  projectCreateMock2,
  semesterProjectCreateMock,
  semesterProjectCreateMock2,
} from '@/test-config/mocks/Project.mock'
import { ZodError } from 'zod'

describe('Test Project Request Models', () => {
  it('should parse and create a valid Project object with client objects as part of the body', async () => {
    const project = CreateProjectRequestBody.parse(projectCreateMock)
    expect(project).toEqual(projectCreateMock)
  })

  it('should parse and create a valid Project object with client ids as part of the body', async () => {
    const project = CreateProjectRequestBody.parse(projectCreateMock2)
    expect(project).toEqual(projectCreateMock2)
  })

  it('should throw an error if required properties are missing', async () => {
    assert.throws(
      () => CreateProjectRequestBody.parse({ ...projectCreateMock2, name: undefined }),
      ZodError,
    )
  })

  it('Should parse and create a valid semesterproject object with project id and semester id as part of the body', async () => {
    const semesterProject = CreateSemesterProjectRequestBody.parse(semesterProjectCreateMock)
    expect(semesterProject).toEqual(semesterProjectCreateMock)
  })

  it('should throw an error if required properties are missing', async () => {
    assert.throws(
      () =>
        CreateSemesterProjectRequestBody.parse({
          ...semesterProjectCreateMock,
          semester: undefined,
        }),
      ZodError,
    )
  })

  it('Should parse and create a valid semesterproject object with project object and semester object as part of the body', async () => {
    const semesterProject = CreateSemesterProjectRequestBody.parse(semesterProjectCreateMock2)
    expect(semesterProject).toEqual(semesterProjectCreateMock2)
  })
})
