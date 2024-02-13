import type { Job } from "@lib/ManfredType";
import { GetTechnologiesFromRoles } from "@lib/Utils";

export interface JobTemplate {
  title: string;
  company: string;
  description: string;
  technologies?: string;
  dates: {
    start: Date;
    finish: Date;
  };
}

export function GetJobs(jobs: Job[]) {
  return jobs.map((job) => {
    return {
      title: job.roles[0].name,
      company: job.organization.name,
      description: job.roles[0].challenges
        ? job.roles[0]?.challenges[0]?.description
        : "",
      technologies: GetTechnologiesFromRoles(job.roles) ?? undefined,
      dates: getJobDates(job),
    } as JobTemplate;
  });
}

function getJobDates(job: Job) {
  const start = new Date(job.roles[0].startDate);
  let finish;
  if (job.roles[job.roles.length - 1].finishDate !== undefined) {
    finish = new Date(job.roles[job.roles.length - 1].finishDate ?? new Date());
  }

  return { start, finish };
}
