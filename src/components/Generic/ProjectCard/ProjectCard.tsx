import { UniqueIdentifier } from '@dnd-kit/core'
import React, {ReactNode} from 'react'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BasicClientDTOPlaceholder {
    name: string;
    email: string;
}

export interface ProjectDTOPlaceholder {
    projectId: string;
    projectName: string;
    projectDescription: string;
    client: BasicClientDTOPlaceholder;
    additionalClients?: BasicClientDTOPlaceholder[];
    desiredOutput: string;
    specialRequirements?: string;
    teamNumber: number;
    semesters: string[];
    submissionDate: Date;
    desiredTeamSkills?: string;
    // resources: ReactNode[] - what do we want this type to be?
}

export interface ProjectCardType {
    id: UniqueIdentifier;
    projectInfo: ProjectDTOPlaceholder;
}

const ProjectCard = ({ id, projectInfo }: ProjectCardType) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: id,
      data: {
        type: 'item',
      },
    });
  
    //TODO: onclick of three dots (or whole card - will this interfere with drag and drop??), show expanded project modal (maybe another endpoint call to fetch all project info? Pass in projectID)
  
    const truncatedDescription = projectInfo.projectDescription.slice(0, 80) + "...";
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition ?? 'transform 200ms ease',
      zIndex: isDragging ? 50 : 'auto',
    };
  
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        style={style}
        className={`relative w-full bg-light-beige rounded-lg ring-1 ring-deeper-blue p-4 overflow-hidden group cursor-pointer transition-all duration-300 ease-in-out ${
          isDragging ? 'opacity-50' : 'hover:shadow-md'
        }`}
      >
        <button {...listeners} className="text-left">
          <div className="absolute inset-0 bg-gradient-to-t from-bright-blue to-light-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-0 rounded-lg" />
          <div className="relative z-10">
            <p className="text-dark-blue-1 text-lg font-bold">{projectInfo.projectName}</p>
            <p className="text-dark-blue-1">{projectInfo.client.name}</p>
            <p className="text-grey-1 py-2">{truncatedDescription}</p>
          </div>
        </button>
  
        <button className="absolute top-5 right-5 text-dark-blue-1 hover:text-black focus:outline-none">
            <img src="/three-dots.svg" alt="Three dots icon" className="h-6 w-6" />
        </button>
      </div>
    );
  };
  
  export default ProjectCard;