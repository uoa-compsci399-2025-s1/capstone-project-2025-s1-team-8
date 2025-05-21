import React, { useState } from 'react'
import Modal from '@/components/Generic/Modal/Modal'
import Button from '@/components/Generic/Button/Button'
import type { ModalProps } from '@/components/Generic/Modal/Modal'
import Input from '@/components/Generic/Input/InputField'
import type { typeToFlattenedError } from 'zod'
import type { CreateSemesterRequestBody } from '@/app/api/admin/semesters/route'

interface SemesterFormProps extends ModalProps {
  semesterId: string
  semesterName?: string
  startDate?: Date
  endDate?: Date
  submissionDeadline?: Date
  edit?: boolean
  onCreated?: () => void
  onUpdated?: () => void
  onDeleted?: () => void
  handleCreateSemester: (formData: FormData) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }>
  handleUpdateSemester: (
    formData: FormData,
    id: string,
  ) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof CreateSemesterRequestBody>
  }>
  handleDeleteSemester: (id: string) => Promise<void | {
    error?: string
    message?: string
  }>
}

const SemesterForm: React.FC<SemesterFormProps> = ({
  semesterId,
  open,
  onClose,
  className = '',
  semesterName,
  startDate,
  endDate,
  submissionDeadline,
  edit = false,
  onCreated,
  onUpdated,
  onDeleted,
  handleCreateSemester,
  handleUpdateSemester,
  handleDeleteSemester,
}) => {
  const [errorState, setErrorState] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const createSemester = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await handleCreateSemester(formData)
    if (res?.error) {
      setErrorMessage(res.error)
      setErrorState(true)
    }
    if (res?.details) {
      setErrorMessage(res.details.formErrors[0])
      setErrorState(true)
    } else if (res?.message) {
      onCreated?.()
      onClose()
    }
  }

  const editSemester = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await handleUpdateSemester(formData, semesterId)
    if (res?.error) {
      setErrorMessage(res.error)
      setErrorState(true)
    }
    if (res?.details) {
      setErrorMessage(res.details.formErrors[0])
      setErrorState(true)
    } else if (res?.message) {
      onUpdated?.()
      onClose()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteSemester = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await handleDeleteSemester(semesterId)
    if (res?.error) {
      setErrorMessage(res.error)
      setErrorState(true)
    } else if (res?.message) {
      onDeleted?.()
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={
        className + ' min-h-fit pt-18 pb-17 px-20 flex flex-col gap-6 w-[700px] -mt-[4%] -mb-[4%]'
      }
    >
      <h1 className="text-3xl font-normal m-0 text-dark-blue font-dm-serif-display">
        {edit ? 'Edit semester' : 'Create a new semester'}
      </h1>
      <p className="text-sm text-dark-blue font-inter">All fields are required.</p>
      <form onSubmit={edit ? editSemester : createSemester}>
        <div className="flex flex-col gap-4 pt-1 pb-8">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-dark-blue font-inter">Semester name</p>
            <Input
              type="text"
              id="semesterName"
              name="semesterName"
              placeholder="Enter name"
              defaultValue={semesterName}
              required={true}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-dark-blue font-inter">Start Date</p>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              placeholder="Start date"
              defaultValue={startDate?.toISOString().split('T')[0]}
              required={true}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-dark-blue font-inter">End Date</p>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              placeholder="End date"
              defaultValue={endDate?.toISOString().split('T')[0]}
              required={true}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-dark-blue font-inter">Submission Deadline</p>
            <Input
              type="date"
              id="submissionDeadline"
              name="submissionDeadline"
              placeholder="Submission deadline"
              defaultValue={submissionDeadline?.toISOString().split('T')[0]}
              required={true}
              className="w-full"
              error={errorState}
              errorMessage={errorMessage}
            />
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <Button variant="dark" size="sm" type="submit">
            {edit ? 'Edit' : 'Create'}
          </Button>
          <Button variant="muted_blue" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SemesterForm
