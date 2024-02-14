import dotenv from "dotenv";
import type { Project } from "./Manfred";
import { FormatDescription, GetLinks, GetTechnologiesFromRoles, SlugName } from "./Utils";

export interface ProjectTemplate {
  title: string;
  description: string;
  urls: ProjectUrl[];
  technologies?: string;
}

export interface ProjectUrl {
  name: string;
  url: string;
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
      description: FormatDescription(project.details.description ?? ""),
      urls: GetLinks(
        project.details.URL ?? "",
        project.details.description ?? ""
      ),
      technologies: GetTechnologiesFromRoles(project.roles),
    } as ProjectTemplate;
  });
}
