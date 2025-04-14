import { adminOnly } from "./AdminAccess"
/* 
*Admin only access object
*/
export const adminOnlyAccess = {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  }