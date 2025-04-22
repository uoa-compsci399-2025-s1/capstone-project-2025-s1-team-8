import React from 'react'
import Modal from '../../Generic/Modal/Modal'
import Button from '@/components/Generic/Button/Button'
import { ModalProps } from '@/components/Generic/Modal/Modal'
import Input from '@/components/Generic/Input/InputField'

interface SemesterFormProps extends ModalProps {
  semesterName?: string
  startDate?: Date
  endDate?: Date
  submissionDeadline?: Date
}

const SemesterForm: React.FC<SemesterFormProps> = ({
  open,
  onClose,
  className = '',
  semesterName,
  startDate,
  endDate,
  submissionDeadline,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={
        className + ' min-h-fit pt-18 pb-17 px-20 flex flex-col gap-6 w-[700px] -mt-[4%] -mb-[4%]'
      }
    >
      <h1 className="text-3xl font-normal m-0 text-dark-blue font-dm-serif-display">
        Create a new semester
      </h1>
      <p className="text-sm text-dark-blue font-inter">All fields are required.</p>
      <div className="flex flex-col gap-4 pt-1 pb-8">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-dark-blue font-inter">Semester name</p>
          <Input
            type="text"
            id="semesterName"
            name="semesterName"
            placeholder="Enter name"
            defaultValue={semesterName}
            errorMessage="Semester Name is required"
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
            errorMessage="Start Date is required"
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
            errorMessage="End Date is required"
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
            errorMessage="Submission Deadline is required"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-row gap-5">
        <Button variant="dark" size="sm" onClick={onClose}>
          Create
        </Button>
        <Button variant="muted_blue" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default SemesterForm
