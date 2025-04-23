import { ClientAdditionalInfo, UserSchema } from "./Payload";

export const ClientCombinedInfo = UserSchema.merge(ClientAdditionalInfo)

export enum UserRole {
  Admin = 'admin',
  Client = 'client',
  Student = 'student',
}
