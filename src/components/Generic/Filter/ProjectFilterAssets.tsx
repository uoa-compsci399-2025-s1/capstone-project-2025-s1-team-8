import { DropdownOptionType } from './FilterInner'

export type SortableKeys = 'projectName' | 'clientName' | 'submissionDate'

const DnDFilterNameLookup = {
  Title: 'projectName',
  Client: 'clientName',
  'Submission Date': 'submissionDate',
}

export const DefaultDropdownOptions: DropdownOptionType[] = [
  {
    text: 'Title',
    key: DnDFilterNameLookup['Title'],
    hasActiveStyles: true,
  },
  { text: 'Client', key: DnDFilterNameLookup['Client'], hasActiveStyles: true },
  { text: 'Submission Date', key: DnDFilterNameLookup['Submission Date'], hasActiveStyles: true },
]
