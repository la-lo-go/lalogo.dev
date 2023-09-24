export interface ManfredRaw {
    $schema: string
    settings: Settings
    aboutMe: AboutMe
    experience: Experience
    knowledge: Knowledge
    careerPreferences: CareerPreferences
    manfredSpecificData: ManfredSpecificData
  }
  
  export interface Settings {
    language: string
    MACVersion: string
  }
  
  export interface AboutMe {
    profile: Profile
    recommendations: Recommendation[]
  }
  
  export interface Profile {
    name: string
    surnames: string
    title: string
    description: string
    location: Location
  }
  
  export interface Location {
    notes: string
    country: string
    region: string
    municipality: string
  }
  
  export interface Recommendation {
    title: string
    type: string
    URL: string
  }
  
  export interface Experience {
    jobs: Job[]
    projects: Project[]
    publicArtifacts: PublicArtifact[]
  }
  
  export interface Job {
    organization: Organization
    roles: Role[]
  }
  
  export interface Organization {
    name: string
    image: Image
    URL: string
  }
  
  export interface Image {
    link: string
    alt: string
  }
  
  export interface Role {
    name: string
    startDate: string
    finishDate: string
    challenges: Challenge[]
    competences: Competence[]
  }
  
  export interface Challenge {
    description: string
  }
  
  export interface Competence {
    name: string
    type: string
  }
  
  export interface Project {
    details: Details
    type: string
    roles: Role2[]
  }
  
  export interface Details {
    name: string
    description: string
    URL: string
    image: Image2
  }
  
  export interface Image2 {
    link: string
    alt: string
  }
  
  export interface Role2 {
    name: string
    startDate: string
    competences: Competence2[]
    finishDate?: string
  }
  
  export interface Competence2 {
    name: string
    type: string
  }
  
  export interface PublicArtifact {
    details: Details2
    type: string
    publishingDate: string
    tags: string[]
    relatedCompetences: RelatedCompetence[]
  }
  
  export interface Details2 {
    name: string
    description?: string
    image: Image3
  }
  
  export interface Image3 {
    link: string
    alt: string
  }
  
  export interface RelatedCompetence {
    name: string
    type: string
  }
  
  export interface Knowledge {
    languages: Language[]
    hardSkills: HardSkill[]
    studies: Study[]
    softSkills: SoftSkill[]
  }
  
  export interface Language {
    name: string
    level: string
  }
  
  export interface HardSkill {
    skill: Skill
  }
  
  export interface Skill {
    name: string
    type: string
  }
  
  export interface Study {
    studyType: string
    degreeAchieved: boolean
    name: string
    startDate: string
    institution: Institution
    finishDate: string
  }
  
  export interface Institution {
    name: string
    image: Image4
  }
  
  export interface Image4 {
    link: string
    alt: string
  }
  
  export interface SoftSkill {
    skill: Skill2
  }
  
  export interface Skill2 {
    name: string
    type: string
  }
  
  export interface CareerPreferences {
    contact: Contact
    preferences: Preferences
    status: string
  }
  
  export interface Contact {
    publicProfiles: PublicProfile[]
    contactMails: string[]
    phoneNumbers: PhoneNumber[]
  }
  
  export interface PublicProfile {
    URL: string
    type: string
  }
  
  export interface PhoneNumber {
    number: string
    countryCode: string
  }
  
  export interface Preferences {
    preferredCompetences: PreferredCompetence[]
    preferredRoles: string[]
  }
  
  export interface PreferredCompetence {
    name: string
    type: string
  }
  
  export interface ManfredSpecificData {
    desiredJobDescription: string
    goodPractices: string
    projects: Project2[]
    bookmarks: Bookmark[]
  }
  
  export interface Project2 {
    name: string
  }
  
  export interface Bookmark {
    name: string
    imageUrl: string
  }
  