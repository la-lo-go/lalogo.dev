import type { ProjectTemplate } from "../types/ProjectTemplate";

const netflixEnhaced: ProjectTemplate = {
  title: "Netflix Enhanced",
  description:
  "Browser extension to blur posible spoilers and autoskip intros",
  url: "https://github.com/la-lo-go/netflix-enhanced",
};

const Images2Stickers: ProjectTemplate = {
  title: "Images To Stickers",
  description:
  "Create Whatsapp and iMessage stickers packs automatically",
  url: "https://github.com/la-lo-go/images-2-stickers",
};

const twitterUserScraper: ProjectTemplate = {
  title: "Twitter User Scraper",
  description:
  "Backup the follows and followers of twitter users on MEGA of and see the changes between the old and the new copies",
  url: "https://github.com/la-lo-go/twitter-user-scraper",
};

export const byName = {
  netflixEnhaced,
  Images2Stickers,
  twitterUserScraper,
};

export const otherProjects = Object.values(byName);
