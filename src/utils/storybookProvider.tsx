import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Decorator } from '@storybook/react'
import { NuqsAdapter } from 'nuqs/adapters/react'

const queryClient = new QueryClient()

export const QueryClientDecorator: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <NuqsAdapter>
      <Story />
    </NuqsAdapter>
  </QueryClientProvider>
)
