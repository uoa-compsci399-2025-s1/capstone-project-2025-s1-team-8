import type { DNDType } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { User } from '@/payload-types'
import type { UniqueIdentifier } from '@dnd-kit/core'

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
      case 'projectName': {
        const sorted = [...container.currentItems].sort((a, b) =>
          a.projectInfo.name.localeCompare(b.projectInfo.name),
        )
        return {
          ...container,
          currentItems: sorted,
        }
      }

      case 'clientName': {
        const sorted = [...container.currentItems].sort((a, b) => {
          const nameA =
            (a.projectInfo.client as User).firstName + ' ' + (a.projectInfo.client as User).lastName
          const nameB =
            (b.projectInfo.client as User).firstName + ' ' + (b.projectInfo.client as User).lastName
          return nameA.localeCompare(nameB)
        })
        return {
          ...container,
          currentItems: sorted,
        }
      }

      case 'submissionDate': {
        const sorted = [...container.currentItems].sort(
          (a, b) =>
            new Date(a.projectInfo.createdAt).getTime() -
            new Date(b.projectInfo.createdAt).getTime(),
        )
        return {
          ...container,
          currentItems: sorted,
        }
      }

      case 'originalOrder': {
        return {
          ...container,
          currentItems: [...container.originalItems],
        }
      }

      default:
        return container
    }
  })
}
