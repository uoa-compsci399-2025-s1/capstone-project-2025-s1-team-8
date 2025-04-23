import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

// Components
import ProjectContainer from './ProjectContainer'
import DraggableProjectCard from '@/components/Generic/ProjectCard/DraggableProjectCard'
import { FilterProvider } from '@/contexts/FilterContext'
import {
  ProjectCardType,
  ProjectDTOPlaceholder,
} from '@/components/Generic/ProjectCard/DraggableProjectCard'

type DNDType = {
  id: UniqueIdentifier
  title: string
  containerColor: 'light' | 'medium' | 'dark'
  items: ProjectCardType[]
}

type DndComponentProps = {
  presetContainers: DNDType[]
}

const defaultProjectInfo: ProjectDTOPlaceholder = {
  projectId: '',
  projectName: '',
  projectDescription: '',
  client: {
    name: '',
    email: '',
  },
  desiredOutput: '',
  teamNumber: 0,
  semesters: [],
  submissionDate: new Date(),
}

const ProjectDnD: React.FC<DndComponentProps> = (presetContainers) => {
  const [containers, setContainers] = useState<DNDType[]>(presetContainers.presetContainers)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  function sortProjects(containerId: UniqueIdentifier, filter: string): void {
    setContainers((prevContainers) => {
      return prevContainers.map((container) => {
        if (container.id !== containerId) return container

        const sortedItems = [...container.items]

        switch (filter) {
          case 'projectName':
            sortedItems.sort((a, b) =>
              a.projectInfo.projectName.localeCompare(b.projectInfo.projectName),
            )
            break
          case 'clientName':
            sortedItems.sort((a, b) =>
              a.projectInfo.client.name.localeCompare(b.projectInfo.client.name),
            )
            break
          case 'submissionDate':
            sortedItems.sort(
              (a, b) =>
                new Date(a.projectInfo.submissionDate).getTime() -
                new Date(b.projectInfo.submissionDate).getTime(),
            )
            break
          default:
            return container // return unchanged if unknown filter
        }

        return {
          ...container,
          items: sortedItems,
        }
      })
    })
  }

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === 'container') {
      return containers.find((item) => item.id === id)
    }
    if (type === 'item') {
      return containers.find((container) => container.items.find((item) => item.id === id))
    }
  }

  const findItemInfo = (id: UniqueIdentifier | undefined): ProjectDTOPlaceholder => {
    if (!id) return defaultProjectInfo

    const container = findValueOfItems(id, 'item')
    if (!container) return defaultProjectInfo

    const item = container.items.find((item) => item.id === id)
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
      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
      const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id)
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        )

        setContainers(newItems)
      } else {
        // In different containers
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
        newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
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
      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

      // Remove the active item from the active container and add it to the over container
      const newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
      newItems[overContainerIndex].items.push(removeditem)
      setContainers(newItems)
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    //TODO: pass new status to backend and at same time, update backend with approval list ordering
    const { active, over } = event

    // Handling Container Sorting
    if (
      active.id.toString().includes('container') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex((container) => container.id === active.id)
      const overContainerIndex = containers.findIndex((container) => container.id === over.id)
      // Swap the active and over container
      let newItems = [...containers]
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
      setContainers(newItems)
    }

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
      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
      const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id)

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        )
        setContainers(newItems)
      } else {
        // In different containers
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
        newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
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
      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

      const newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
      newItems[overContainerIndex].items.push(removeditem)
      setContainers(newItems)
    }
    setActiveId(null)
  }

  return (
    <div className="mx-auto mx-auto w-full">
      <div className="flex gap-7 mt-10 flex-wrap md:flex-nowrap">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          {containers.map((container) => (
            <FilterProvider key={container.id}>
              <ProjectContainer
                id={container.id}
                containerName={container.title}
                projects={container.items}
                onChange={(newFilter) => {
                  sortProjects(container.id, newFilter)
                }}
                containerColor={container.containerColor}
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
      </div>
    </div>
  )
}

export default ProjectDnD
