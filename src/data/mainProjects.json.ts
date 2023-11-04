import type { ProjectTemplate } from "../types/ProjectTemplate";

const Mangateca: ProjectTemplate = {
    title: "Mangateca",
    description: "Web App to read manga in spanish using my API man-go.",
    url: "https://mangateca.vercel.app/"
};

const ManGo: ProjectTemplate = {
    title: "Man-go",
    description: "Go RESTful API for search mangas, their chapters and pages from different websites simultaneously.",
    url: "https://github.com/la-lo-go/man-go"
};

const QbitTelegram: ProjectTemplate = {
    title: "QbitTelegram",
    description: "BitTorrent's client for Telegram to manage easily and securely from anywhere torrent downloading from your server",
    url: "https://github.com/la-lo-go/qBitTelegram"
};

const ThePHPoly: ProjectTemplate = {
    title: "The PHPoly",
    description: "Monopoly web port with vanilla JavaScript and SCSS.",
    url: "https://la-lo-go.github.io/the-PHPoly/index_html.html"
};

export const byName = {
    Mangateca,
    ManGo,
    QbitTelegram,
    ThePHPoly
};

export const mainProjects = Object.values(byName);