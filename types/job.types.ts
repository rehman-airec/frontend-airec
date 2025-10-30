export interface Location {
  city: string;
  country: string;
  remote: boolean;
  alternateLocations?: AlternateLocation[];
}

export interface AlternateLocation {
  city: string;
  country: string;
}

export interface SalaryRange {
  min?: number;
  max?: number;
  currency: string;
  hideFromCandidates?: boolean;
  type?: 'Fixed' | 'Variable' | 'Commission' | 'Hourly';
  period?: 'Yearly' | 'Monthly' | 'Weekly' | 'Hourly';
}

export interface ScreeningQuestion {
  questionId: string;
  text: string;
  type: 'text' | 'short-text' | 'long-text' | 'multiple-choice' | 'yes-no' | 'rating';
  required: boolean;
  options?: string[];
  maxLength?: number;
  placeholder?: string;
  correctAnswer?: string;
}

export interface ScreeningQuestionFormData {
  text: string;
  type: 'text' | 'short-text' | 'long-text' | 'multiple-choice' | 'yes-no' | 'rating';
  required: boolean;
  options?: string[];
  maxLength?: number;
  placeholder?: string;
  correctAnswer?: string;
}

export interface HiringManager {
  name: string;
  email: string;
  phone?: string;
}

export interface Interviewer {
  name: string;
  email: string;
  role?: string;
}

export interface HiringTeamMember {
  name: string;
  email: string;
  role: string;
}

export interface Job {
  _id: string;
  title: string;
  jobFunctions: string[];
  location: Location;
  department: string;
  description: string;
  experienceRequiredYears: string;
  toolsTechnologies: string[];
  educationCertifications: string[];
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary' | 'Volunteer';
  workplaceTypes: ('Remote' | 'On-site' | 'Hybrid')[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  salaryRange?: SalaryRange;
  salaryBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  leaderboard: boolean;
  positions: number;
  interviewQuestions: string[];
  hiringManager?: HiringManager;
  assignProjectClient?: string;
  screeningQuestions: ScreeningQuestion[];
  hiringTeam: HiringTeamMember[];
  interviewers: Interviewer[];
  workflow: string[];
  publishedOn: string[];
  isPublished: boolean;
  publishedAt?: string;
  expiryDate?: string;
  applicationDeadline?: string;
  maxApplications: number;
  currentApplications: number;
  status: 'draft' | 'published' | 'closed' | 'archived';
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobCreateRequest {
  title: string;
  jobFunctions?: string[];
  location: Location;
  department: string;
  description: string;
  experienceRequiredYears?: string;
  toolsTechnologies?: string[];
  educationCertifications?: string[];
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  employmentType: string;
  jobType?: string;
  workplaceTypes?: ('Remote' | 'On-site' | 'Hybrid')[];
  experienceLevel: string;
  salaryRange?: SalaryRange;
  salaryBudget?: {
    min: number;
    max: number;
    currency: string;
  };
  leaderboard?: boolean;
  positions?: number;
  interviewQuestions?: string[];
  hiringManager?: HiringManager;
  assignProjectClient?: string;
  screeningQuestions?: ScreeningQuestion[];
  hiringTeam?: HiringTeamMember[];
  interviewers?: Interviewer[];
  workflow?: string[];
  expiryDate?: string;
  applicationDeadline?: string;
  maxApplications?: number;
  tags?: string[];
}

export interface JobUpdateRequest extends Partial<JobCreateRequest> {}

export interface JobPublishRequest {
  publishedOn?: string[];
}

export interface JobFilters {
  q?: string;
  city?: string;
  department?: string;
  employmentType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchResponse {
  success: boolean;
  jobs: Job[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

// Normalized job response for admin jobs list (lightweight)
export interface NormalizedAdminJob {
  _id: string;
  title: string;
  status: string; // 'Published' | 'Live' | 'Draft' | etc.
  department: string;
  location: string; // Formatted location string
  type: string; // 'Full-time' | 'Part-time' | etc.
  salary: string; // Formatted salary string
  numberOfApplications: number;
  createdAt: string;
  publishedAt: string | null;
  additionalRequirement: string;
}

export interface JobStats {
  total: number;
  published: number;
  draft: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
}
