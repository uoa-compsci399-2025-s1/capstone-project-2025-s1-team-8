import type { CollectionConfig } from 'payload'

export const FormQuestion: CollectionConfig = {
  slug: 'formQuestion',
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The question title, e.g. Whats your name?',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      admin: {
        description:
          'The description of this question provides more information about how the question can be answered! E.g. Enter a number',
      },
    },
    {
      name: 'fieldName',
      type: 'text',
      required: true,
      admin: {
        description: 'An identifiable field name key, e.g. final_presentation_confirm',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: {
        description: 'The question ordering ascending order, e.g. 0',
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      required: true,
      admin: {
        description: 'If the question is required or not, e.g. true',
      },
    },
  ],
}
