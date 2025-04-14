import { adminOnly } from "./AdminAccess"
export const adminOnlyAccess = {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  }