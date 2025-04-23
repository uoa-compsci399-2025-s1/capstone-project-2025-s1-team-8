import { ClientAdditionalInfoSchema, UserSchema } from './Payload'

export const ClientCombinedInfo = UserSchema.merge(ClientAdditionalInfoSchema)

export enum UserRole {
  Admin = 'admin',
  Client = 'client',
  Student = 'student',
}
