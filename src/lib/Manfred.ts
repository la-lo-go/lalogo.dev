import type { ProjectTemplate, ProjectUrl } from "./ProjectPortfolio";
import { FormatDescription, GetLinks, GetTechnologiesFromRoles, SlugName } from "@lib/Utils";
import dotenv from "dotenv";

export interface Manfred {
  experience: Experience;
}

export interface Experience {
  jobs: Job[];
  projects: Project[];
  publicArtifacts: PublicArtifact[];
}

export interface Job {
  organization: Organization;
  roles: Role[];
}

export interface Organization {
  name: string;
  image: Image;
  URL?: string;
  description?: string;
}

export interface Image {
  link: string;
  alt: string;
}

export interface Role {
  name: string;
  startDate: Date;
  finishDate?: Date;
  challenges?: Challenge[];
  competences: Competence[];
}

export interface Challenge {
  description: string;
}

export interface Competence {
  name: string;
  type: Type;
}

export enum Type {
  Technology = "technology",
}

export interface Project {
  details: Organization;
  type: string;
  roles: Role[];
  urls?: ProjectUrl[];
}

export interface PublicArtifact {
  details: Organization;
  type: string;
  publishingDate: Date;
  tags: string[];
  relatedCompetences: Competence[];
}