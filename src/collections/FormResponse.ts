import type { CollectionConfig } from 'payload'
import { QuestionResponse } from '@/types/QuestionResponse'
import { array } from 'payload/shared'
import { FormQuestion } from './FormQuestion'

export const FormResponse: CollectionConfig = {
  slug: 'formresponse',
  fields: [
    {
        name: "name",
        type: "text",
        required: true,
    },
    {
        name: "description",
        type: "textarea",
        required: true,
    },
    {
        name: "clients",
        type: "relationship",
        relationTo: "user",
        hasMany: true,
    },
    {
        name: "questionResponses",
        type: "array",
        fields: [
            {
                name: "question",
                type: "relationship",
                relationTo: "formQuestion",
                required: true,
            },
            {
                name: "answer",
                type: "textarea",
                required: true,                
            }
        ]

    }
  ],
}
