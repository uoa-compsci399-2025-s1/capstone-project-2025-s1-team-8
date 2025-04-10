import type { CollectionConfig } from 'payload'
import { Status } from '@/types/StatusTypes'

export const Project: CollectionConfig = {
  slug: 'project',
  fields: [
    {
      name: 'number',
      type: 'number',
      required: false,
    },
    {
        name: "name",
        type: "text",
        required: true,
    },
    {
        name: "clients",
        relationTo: "user",
        type: "relationship",
        hasMany: true,
        required: true,
    },
    {
        name: "description",
        type: "textarea",
        required: true,
    },
    {
        name: "attachments",
        type: "upload",
        relationTo: "media", // placeholder for attachments
        hasMany: true,
        maxRows: 5
    },
    {
        name: "status",
        type: "select",
        required: true,
        defaultValue: Status.Pending,
        options: Object.values(Status)

    },
    /*{
        name: "semester",
        relationTo: "semester",
        type: "relationship",
        hasMany: false,
        required: true,
    },*/
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      required: true,

    },
    {
        name: "deadline",
        type: "date",
        timezone: true,
        required: true,
    },
    {
        name: "timestamp",
        type: "date",
        timezone: true,
        required: true,
    },
    /*{
        name: "form",
        relationTo: "form",
        type: "relationship",
        hasMany: false,
        required: true,
    },*/

  ],
}
