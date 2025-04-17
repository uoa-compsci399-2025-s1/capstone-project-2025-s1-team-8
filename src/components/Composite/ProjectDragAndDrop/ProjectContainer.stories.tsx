import { ComponentMeta, ComponentStory, StoryFn } from '@storybook/react'
import ProjectContainer, { ProjectContainerType } from './ProjectContainer'
import { DndContext } from '@dnd-kit/core'
import { FilterProvider } from '@/contexts/FilterContext'
import { fn } from '@storybook/test' // Import the fn helper

export default {
  title: 'Composite/ProjectContainer',
  component: ProjectContainer,
  decorators: [
    (Story: StoryFn) => (
      <DndContext>
        <FilterProvider>
          <Story />
        </FilterProvider>
      </DndContext>
    ),
  ],
} as ComponentMeta<typeof ProjectContainer>

// Explicitly type args as ProjectContainerType
const Template: ComponentStory<typeof ProjectContainer> = (args: ProjectContainerType) => (
  <ProjectContainer {...args} />
)

export const Default = Template.bind({})
Default.args = {
  id: 'container-1',
  containerName: 'Drafts',
  containerColor: 'light',
  projects: [
    {
      id: 'proj-1',
      projectInfo: {
        projectId: 'p1',
        projectName: 'AI Research Tool',
        projectDescription: 'A tool to support literature review using ML',
        client: { name: 'Jane Doe', email: 'jane@example.com' },
        desiredOutput: 'Prototype & report',
        teamNumber: 3,
        semesters: ['S1 2025'],
        submissionDate: new Date(),
      },
    },
    {
      id: 'proj-2',
      projectInfo: {
        projectId: 'p2',
        projectName: 'Chronobiology',
        projectDescription:
          'Another very interested description goes here. This project is all about biology and other science related things.',
        client: { name: 'John Doe', email: 'johndoe@gmail.com' },
        desiredOutput: 'Prototype & report',
        teamNumber: 3,
        semesters: ['S1 2025'],
        submissionDate: new Date(),
      },
    },
  ],
  onChange: fn(),
} as ProjectContainerType
