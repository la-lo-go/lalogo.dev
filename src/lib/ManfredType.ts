import type { ProjectTemplate, ProjectUrl } from "./ProjectTemplate";
import { GetTechnologiesFromRoles, SlugName } from "@lib/Utils";
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

// get the main projects from the .env file
dotenv.config();
const mainProjects = process.env.MAIN_PROJECTS ?? "";

export function GetMainProjects(projects: Project[]) {
  const mainProjectsNames = mainProjects.split(";");
  const mainProjectsMap = mainProjectsNames.reduce((map, name) => {
    map[name] = true;
    return map;
  }, {} as Record<string, boolean>);

  const orderedProjects = projects
    .filter((project) => {
      // filter out projects that are not in the main list
      const name = SlugName(project.details.name);
      return mainProjectsMap[name];
    })
    .sort((project1, project2) => {
      // sort projects by the order in the mainProjects list
      const project1Index = getProjectIndex(project1, mainProjectsNames);
      const project2Index = getProjectIndex(project2, mainProjectsNames);

      return project1Index - project2Index;
    });

  return getProjects(orderedProjects as Project[]);
}

export function GetOtherProjects(projects: Project[]) {
  const mainProjectsNames = mainProjects.split(";");
  const mainProjectsMap = mainProjectsNames.reduce((map, name) => {
    map[name] = true;
    return map;
  }, {} as Record<string, boolean>);

  const otherProjects = projects.filter((project) => {
    const name = SlugName(project.details.name);
    return !mainProjectsMap[name];
  });

  return getProjects(otherProjects as Project[]);
}

function getProjectIndex(project: Project, mainProjectsNames: string[]) {
  const name = SlugName(project.details.name);
  return mainProjectsNames.indexOf(name);
}

function getProjects(projects: Project[]) {
  return projects.map((project) => {
    return {
      title: project.details.name,
      description: formatDescription(project.details.description ?? ""),
      urls: getLinks(
        project.details.URL ?? "",
        project.details.description ?? ""
      ),
      technologies: GetTechnologiesFromRoles(project.roles),
    } as ProjectTemplate;
  });
}

// parse a markdown text  to get the first sentence
export function formatDescription(text: string) {
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const noLinks = text.replace(linkRegex, (_, text, link) => text);

  const noLineBreaks = noLinks.replace(/\n/g, " ");
  const noMultipleSpaces = noLineBreaks.replace(/ +/g, " ");

  // get the first sentence of the text
  const firstSentenceRegex = /(^.*?[a-z]{2,}[.!?])\s+\W*[A-Z]/;
  const firstSentence =
    noMultipleSpaces.match(firstSentenceRegex)?.[1] ?? noMultipleSpaces;

  return firstSentence;
}

function getLinks(url: string, description: string): ProjectUrl[] {
  const urls = url ? [{ name: "GitHub repo", url: url }] : [];
  const descriptionUrls = extractDescriptionLinks(description);

  return urls.concat(descriptionUrls);
}

function extractDescriptionLinks(description: string): Array<ProjectUrl> {
  const regex = /\[(.*?)\]\(([^)]+)\)/g;
  let match;
  const links = [];

  while ((match = regex.exec(description)) !== null) {
    links.push({ name: match[1], url: match[2] });
  }

  return links;
}
