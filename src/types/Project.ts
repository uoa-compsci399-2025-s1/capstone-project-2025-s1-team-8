import { Semester, Project } from "@/payload-types";

export enum ProjectStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export type ProjectWithSemesters = Project & {
  semesters: Semester[];
  semesterProjectId?: string;
}