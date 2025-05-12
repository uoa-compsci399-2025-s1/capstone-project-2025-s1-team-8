import { Project } from "@/payload-types";
import { clientMocks } from "./newClients.mock";

export const mockProjects: Project[] = [
    {
        id: "p1",
        name: "Project 1",
        description: "Description of Project 1",
        client: clientMocks[0],
        timestamp: "2023-10-01T12:00:00Z",
        desiredOutput: "Desired output for Project 1",
        specialEquipmentRequirements: "Special equipment for Project 1",
        numberOfTeams: "Up to 3 teams",
        futureConsideration: true,
        createdAt: "2023-10-01T12:00:00Z",
        updatedAt: "2023-10-01T12:00:00Z",
    },
        {
        id: "p2",
        name: "Project 2",
        description: "Description of Project 2",
        client: clientMocks[0],
        additionalClients: [
            clientMocks[1],
            clientMocks[2],
        ],
        timestamp: "2023-10-01T12:00:00Z",
        desiredOutput: "Desired output for Project 2",
        specialEquipmentRequirements: "Special equipment for Project 2",
        numberOfTeams: "Up to 10 teams",
        futureConsideration: true,
        createdAt: "2023-10-01T12:00:00Z",
        updatedAt: "2023-10-01T12:00:00Z",
        },
            {
        id: "p3",
        name: "Project 3",
        description: "Description of Project 3",
        client: clientMocks[2],
        timestamp: "2023-10-01T12:00:00Z",
        desiredOutput: "Desired output for Project 3",
        specialEquipmentRequirements: "Special equipment for Project 3",
        numberOfTeams: "Up to 2 teams",
        futureConsideration: true,
        createdAt: "2023-10-01T12:00:00Z",
        updatedAt: "2023-10-01T12:00:00Z",
    }
]