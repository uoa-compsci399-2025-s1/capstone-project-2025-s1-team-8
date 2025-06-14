'use client'

import { useState } from 'react'
import type { DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import ProjectContainer from './ProjectContainer'
import DraggableProjectCard from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { FilterProvider } from '@/contexts/FilterContext'
import type { ProjectCardType } from '@/components/Generic/ProjectCard/DraggableProjectCard'
import type { ProjectDetails, ProjectStatus } from '@/types/Project'
import { FiSave, FiPrinter } from 'react-icons/fi'
import Notification from '@/components/Generic/Notification/Notification'
import RadialMenu from '@/components/Composite/RadialMenu/RadialMenu'
import { HiOutlineDocumentDownload } from 'react-icons/hi'
import { sortProjects } from '@/lib/util/AdminUtil'
import { useQueryClient } from '@tanstack/react-query'
import type { PatchSemesterProjectRequestBody } from '@/app/api/admin/semesters/[id]/projects/[projectId]/route'
import type { typeToFlattenedError } from 'zod'

export type DNDType = {
  id: UniqueIdentifier
  title: ProjectStatus
  containerColor: 'light' | 'medium' | 'dark'
  currentItems: ProjectCardType[]
  originalItems: ProjectCardType[]
}

export interface SemesterContainerData {
  presetContainers: DNDType[]
  semesterId: string
}

export type DndComponentProps = SemesterContainerData & {
  onSaveChanges: (params: SemesterContainerData) => Promise<void | {
    error?: string
    message?: string
    details?: typeToFlattenedError<typeof PatchSemesterProjectRequestBody>
  }>
  onPublishChanges: (semesterId: string) => Promise<void | {
    error?: string
    message?: string
  }>
  onDeleteProject: (projectId: string) => Promise<{
    error?: string
    message?: string
  }>
  deletedProject: () => void
}

type Notification = {
  title: string
  message: string
  type: 'success' | 'warning'
} | null

const defaultProjectInfo: ProjectDetails = {
  id: '',
  name: '',
  description: '',
  client: '',
  additionalClients: null,
  attachments: null,
  deadline: null,
  desiredOutput: '',
  specialEquipmentRequirements: '',
  numberOfTeams: '',
  desiredTeamSkills: null,
  availableResources: null,
  questionResponses: null,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  semesters: [],
  semesterProjectId: undefined,
}

const ProjectDnD: React.FC<DndComponentProps> = ({
  presetContainers,
  semesterId,
  onSaveChanges,
  onPublishChanges,
  onDeleteProject,
  deletedProject,
}) => {
  const [containers, setContainers] = useState<DNDType[]>([...presetContainers])
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [notification, setNotification] = useState<Notification>(null)
  const [hasChanges, setHasChanges] = useState(false) //Used to track when items have been moved

  const buttonItems = [
    { Icon: FiSave, value: 'save', label: 'Save' },
    { Icon: FiPrinter, value: 'publish', label: 'Publish' },
    { Icon: HiOutlineDocumentDownload, value: 'downloadcsv', label: 'Download CSV' },
  ]

  const queryClient = useQueryClient()

  //TODO: when items are moved around, remove the active filter styles

  const [containerFilters, setContainerFilters] = useState<Record<string, string | undefined>>(() =>
    Object.fromEntries(presetContainers.map((c) => [c.id, 'originalOrder'])),
  )

  const handleFilterChange = (containerId: UniqueIdentifier, newFilter?: string) => {
    setContainerFilters((prev) => ({
      ...prev,
      [containerId]: newFilter, // `undefined` clears it
    }))

    if (newFilter) {
      setContainers((prevContainers) => sortProjects(prevContainers, containerId, newFilter))
    }
  }

  async function handleSaveChanges() {
    setHasChanges(false)
    const savedChangesMessage = await onSaveChanges({ presetContainers: containers, semesterId })
    if (savedChangesMessage && 'error' in savedChangesMessage) {
      setNotification({
        title: 'Error',
        message: 'There was an error saving your changes. Please try again.',
        type: 'warning',
      })
    } else {
      setNotification({
        title: 'Success',
        message: 'Your changes have been saved successfully!',
        type: 'success',
      })
    }
    await queryClient.invalidateQueries({ queryKey: ['semesterProjects'] })
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    await queryClient.invalidateQueries({ queryKey: ['studentPage'] })

    setContainers((prev) =>
      prev.map((container) => ({
        ...container,
        originalItems: [...container.currentItems],
      })),
    )
  }

  async function handlePublishChanges() {
    const publishMessage = await onPublishChanges(semesterId)
    if (publishMessage && 'error' in publishMessage) {
      setNotification({
        title: 'Error',
        message: 'There was an error publishing the approved projects. Please try again.',
        type: 'warning',
      })
    } else {
      setNotification({
        title: 'Success',
        message: 'The approved projects have been successfully published!',
        type: 'success',
      })
    }
    await queryClient.invalidateQueries({ queryKey: ['studentPage'] })
  }

  function handleDownloadCsv() {
    window.open(`/api/admin/export/semesters/${semesterId}`, '_blank')
    setNotification({
      title: 'Success',
      message: 'You have successfully downloaded the list of projects.',
      type: 'success',
    })
  }

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id)
    }
    if (type === 'item') {
      return containers.find((container) => container.currentItems.find((item) => item.id === id))
    }
  }

  const findItemInfo = (id: UniqueIdentifier | undefined): ProjectDetails => {
    if (!id) return defaultProjectInfo

    const container = findValueOfItems(id, 'item')
    if (!container) return defaultProjectInfo

    const item = container.currentItems.find((item) => item.id === id)
    if (!item || !item.projectInfo) return defaultProjectInfo

    return item.projectInfo
  }

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const { id } = active
    setActiveId(id)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event

    // Handle Items Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'item')

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      )

      // Find the index of the active and over item
      const activeItemIndex = activeContainer.currentItems.findIndex(
        (item) => item.id === active.id,
      )
      const overItemIndex = overContainer.currentItems.findIndex((item) => item.id === over.id)
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]
        newItems[activeContainerIndex].currentItems = arrayMove(
          newItems[activeContainerIndex].currentItems,
          activeItemIndex,
          overItemIndex,
        )

        setContainers(newItems)
      } else {
        // In different containers
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].currentItems.splice(activeItemIndex, 1)
        newItems[overContainerIndex].currentItems.splice(overItemIndex, 0, removeditem)

        // Handle moving in originalItems array
        const activeItemIndexOriginal = activeContainer.originalItems.findIndex(
          (item) => item.id === active.id,
        )
        const [removedItemOriginal] = newItems[activeContainerIndex].originalItems.splice(
          activeItemIndexOriginal,
          1,
        )
        newItems[overContainerIndex].originalItems.unshift(removedItemOriginal)

        // handleFilterChange(activeContainerIndex)
        setContainers(newItems)
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'container')

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      )

      // Find the index of the active and over item
      const activeItemIndex = activeContainer.currentItems.findIndex(
        (item) => item.id === active.id,
      )

      // Remove the active item from the active container and add it to the over container
      const newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].currentItems.splice(activeItemIndex, 1)
      newItems[overContainerIndex].currentItems.push(removeditem)
      if (activeContainer != overContainer) {
        const activeItemIndexOriginal = activeContainer.originalItems.findIndex(
          (item) => item.id === active.id,
        )
        const [removedItemOriginal] = newItems[activeContainerIndex].originalItems.splice(
          activeItemIndexOriginal,
          1,
        )
        newItems[overContainerIndex].originalItems.unshift(removedItemOriginal)
      }
      setContainers(newItems)
    }
  }

  // This is the function that handles the sorting of items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    if (!hasChanges) {
      setNotification({
        title: 'Unsaved changes',
        message: "You\'ve made changes to the project order. Don\'t forget to save!",
        type: 'warning',
      })
      setHasChanges(true)
    }

    const { active, over } = event

    // Handling item Sorting
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'item')

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      )
      // Find the index of the active and over item
      const activeItemIndex = activeContainer.currentItems.findIndex(
        (item) => item.id === active.id,
      )
      const overItemIndex = overContainer.currentItems.findIndex((item) => item.id === over.id)

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]
        newItems[activeContainerIndex].currentItems = arrayMove(
          newItems[activeContainerIndex].currentItems,
          activeItemIndex,
          overItemIndex,
        )
        setContainers(newItems)
      } else {
        // In different containers
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].currentItems.splice(activeItemIndex, 1)
        newItems[overContainerIndex].currentItems.splice(overItemIndex, 0, removeditem)
        // Handle the changing of the original containers

        const activeItemIndexOriginal = activeContainer.originalItems.findIndex(
          (item) => item.id === active.id,
        )
        const [removedItemOriginal] = newItems[activeContainerIndex].originalItems.splice(
          activeItemIndexOriginal,
          1,
        )
        newItems[overContainerIndex].originalItems.unshift(removedItemOriginal)

        setContainers(newItems)
      }
    }
    // Handling item dropping into Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'container')

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      )
      // Find the index of the active and over item
      const activeItemIndex = activeContainer.currentItems.findIndex(
        (item) => item.id === active.id,
      )

      const newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].currentItems.splice(activeItemIndex, 1)
      newItems[overContainerIndex].currentItems.push(removeditem)

      // Handle the changing of the original containers
      if (activeContainer != overContainer) {
        const activeItemIndexOriginal = activeContainer.originalItems.findIndex(
          (item) => item.id === active.id,
        )
        const [removedItemOriginal] = newItems[activeContainerIndex].originalItems.splice(
          activeItemIndexOriginal,
          1,
        )
        newItems[overContainerIndex].originalItems.unshift(removedItemOriginal)
      }
      setContainers(newItems)
    }
    setActiveId(null)
  }

  return (
    <div className="mx-auto w-full relative">
      <div className="fixed top-6 right-6 z-50">
        <Notification
          isVisible={notification != null}
          title={notification?.title ?? ''}
          message={notification?.message ?? ''}
          type={notification?.type ?? 'warning'}
          onClose={() => setNotification(null)}
        />
      </div>

      <div className="flex gap-6 flex-wrap md:flex-nowrap">
        <DndContext
          id="project-dnd-context"
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {containers?.map((container) => (
            <FilterProvider
              key={container.id}
              value={{
                selectedFilter: containerFilters[container.id],
                setSelectedFilter: (newFilter) => handleFilterChange(container.id, newFilter),
              }}
            >
              <ProjectContainer
                id={container.id}
                containerName={container.title}
                projects={container.currentItems}
                onChange={(newFilter) => handleFilterChange(container.id, newFilter)}
                containerColor={container.containerColor}
                onDelete={onDeleteProject}
                deleted={deletedProject}
              />
            </FilterProvider>
          ))}

          <DragOverlay adjustScale={false}>
            {/* Drag Overlay For item ProjectCard */}
            {activeId && activeId.toString().includes('item') && (
              <DraggableProjectCard id={activeId} projectInfo={findItemInfo(activeId)} />
            )}
          </DragOverlay>
        </DndContext>
        <div className="absolute z-40 right-4 bottom-4">
          <RadialMenu
            items={buttonItems}
            onItemClick={(value) => {
              if (value === 'save') {
                handleSaveChanges()
              }
              if (value === 'publish') {
                handlePublishChanges()
              }
              if (value === 'downloadcsv') {
                handleDownloadCsv()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectDnD
