import { DropdownOptionType } from './FilterInner'

export type SortableKeys =
  | 'projectName'
  | 'clientName'
  | 'submissionDate'
  | 'originalOrder'
  | undefined

const DnDFilterNameLookup = {
  Title: 'projectName',
  Client: 'clientName',
  'Submission date': 'submissionDate',
}

export const DefaultDropdownOptions: DropdownOptionType[] = [
  {
    text: 'Title',
    key: DnDFilterNameLookup['Title'],
    hasActiveStyles: true,
  },
  { text: 'Client', key: DnDFilterNameLookup['Client'], hasActiveStyles: true },
  { text: 'Submission date', key: DnDFilterNameLookup['Submission date'], hasActiveStyles: true },
  { text: 'Original order', key: 'originalOrder', hasActiveStyles: true },
]
