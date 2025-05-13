import { CreateClientAdditionalInfoData, CreateUserData } from '@/types/Collections'
import { UserRole } from '@/types/User'
import { UserCombinedInfo } from '@/types/Collections'

export const adminCreateMock: CreateUserData = {
  role: UserRole.Admin,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoeadmin@gmail.com',
}

export const clientCreateMock: CreateUserData = {
  role: UserRole.Client,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoeclient@gmail.com',
}

export const studentCreateMock: CreateUserData = {
  role: UserRole.Student,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoestudent@gmail.com',
}

export const clientAdditionalInfoCreateMock: CreateClientAdditionalInfoData = {
  client: '67fdc27019dd81b68db9bb64',
  introduction: "Hello i'm a very cool client. My project cool.",
  affiliation: 'Very cool company',
}

export const clientMocks: UserCombinedInfo[] = [
  {
    id: '1',
    firstName: 'David',
    lastName: 'Cumin',
    email: 'davidcumin@gmail.com',
    affiliation: 'University of Auckland',
    introduction: 'Hello nice to meet you! I am David.',
    role: 'client',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-01T12:00:00Z',
  },
  {
    id: '2',
    firstName: 'Dole',
    lastName: 'Paprika',
    email: 'dolepaprika@auckland.ac.nz',
    affiliation: 'University of Auckland',
    introduction: 'Hello nice to meet you!',
    role: 'client',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-01T12:00:00Z',
  },
  {
    id: '3',
    firstName: 'Dana',
    lastName: 'Rosemary',
    email: 'danarosemary@gmail.com',
    affiliation: 'University of Auckland',
    introduction: 'Hello nice to meet you! I am Dana.',
    role: 'client',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2023-10-01T12:00:00Z',
  },
]
