import type { DNDType } from '@/components/Composite/ProjectDragAndDrop/ProjectDnD'
import type { SemesterProject, User } from '@/payload-types'
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

/**
 * Sorts projects based on project number before displaying them in Drag and Drop.
 *
 * @param projects The fetched SemesterProjects for a particular status (rejected, pending or approved)
 * @returns The SemesterProjects sorted by on project number
 */
export function sortByProjectNumber(projects: SemesterProject[]): SemesterProject[] {
  return [...projects].sort((a, b) => {
    const aNum = a.number
    const bNum = b.number

    if (aNum == null && bNum == null) return 0
    if (aNum == null) return 1
    if (bNum == null) return -1
    return bNum - aNum
  })
}
