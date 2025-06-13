import { DNDType } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import { User } from '@/payload-types'
import { UniqueIdentifier } from '@dnd-kit/core'

/**
 * Sorts projects in Drag and Drop based on filter.
 *
 * @param containers The drag and drop containers
 * @param containerId The id of the container to be sorted
 * @param filter The filter being applied to the container
 * @returns The drag and drop containers with the sorted projects in the selected container
 */
export function sortProjects(
  containers: DNDType[],
  containerId: UniqueIdentifier,
  filter: string,
): DNDType[] {
  return containers.map((container) => {
    if (container.id !== containerId) return container

    switch (filter) {
      case 'projectName':
      case 'clientName':
      case 'submissionDate':
        const sorted = [...container.currentItems]
        if (filter === 'projectName') {
          sorted.sort((a, b) => a.projectInfo.name.localeCompare(b.projectInfo.name))
        } else if (filter === 'clientName') {
          sorted.sort((a, b) =>
            (
              (a.projectInfo.client as User).firstName +
              ' ' +
              (a.projectInfo.client as User).lastName
            ).localeCompare(
              (b.projectInfo.client as User).firstName +
                ' ' +
                (b.projectInfo.client as User).lastName,
            ),
          )
        } else if (filter === 'submissionDate') {
          sorted.sort(
            (a, b) =>
              new Date(a.projectInfo.createdAt).getTime() -
              new Date(b.projectInfo.createdAt).getTime(),
          )
        }

        return {
          ...container,
          currentItems: sorted,
        }

      case 'originalOrder':
        return {
          ...container,
          currentItems: [...container.originalItems],
        }

      default:
        return container
    }
  })
}
