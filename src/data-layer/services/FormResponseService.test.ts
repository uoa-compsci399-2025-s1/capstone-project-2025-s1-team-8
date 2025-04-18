import { clearCollection, testPayloadObject } from '@/test-config/utils'
import { FormResponseService } from './FormResponseService'
import { formResponseCreateMock } from '@/test-config/mocks/FormResponse.mock'

describe('Form response service tests', () => {
  const formResponseService = new FormResponseService()

  afterEach(async () => {
    await clearCollection(testPayloadObject, 'formResponse')
  })

  it('should create a form response', async () => {
    const newFormResponse = await formResponseService.createFormResponse(formResponseCreateMock)
    const fetchedFormResponse = await testPayloadObject.findByID({
      collection: 'formResponse',
      id: newFormResponse.id,
    })
    expect(newFormResponse).toEqual(fetchedFormResponse)
  })

  it('should get a form response', async () => {
    const newFormResponse = await formResponseService.createFormResponse(formResponseCreateMock)
    const fetchedFormResponse = await formResponseService.getFormResponse(newFormResponse.id)
    expect(newFormResponse).toEqual(fetchedFormResponse)
  })

  it('should return undefined if form response does not exist', async () => {
    await expect(formResponseService.getFormResponse('nonexistent_id')).rejects.toThrow('Not Found')
  })

  it('should update a form response', async () => {
    const newFormResponse = await formResponseService.createFormResponse(formResponseCreateMock)
    const updatedFormResponse = await formResponseService.updateFormResponse(newFormResponse.id, {
      name: 'AI boyfriend finder',
    })
    expect(updatedFormResponse.name).toEqual('AI boyfriend finder')
  })

  it('should delete a form response', async () => {
    const newFormResponse = await formResponseService.createFormResponse(formResponseCreateMock)
    await formResponseService.deleteFormResponse(newFormResponse.id)
    await expect(
      testPayloadObject.findByID({
        collection: 'formResponse',
        id: newFormResponse.id,
      }),
    ).rejects.toThrow('Not Found')
  })

  it('should throw an error if form response does not exist', async () => {
    await expect(formResponseService.deleteFormResponse('nonexistent_id')).rejects.toThrow(
      'Not Found',
    )
  })
})
