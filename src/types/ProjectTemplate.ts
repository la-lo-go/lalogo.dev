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
