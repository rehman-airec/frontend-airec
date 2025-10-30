// Application constants
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship'
] as const;

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary',
  'Volunteer'
] as const;

export const WORKPLACE_TYPES = [
  'Remote',
  'On-site',
  'Hybrid'
] as const;

export const SALARY_TYPES = [
  'Fixed',
  'Variable',
  'Commission',
  'Hourly'
] as const;

export const SALARY_PERIODS = [
  'Yearly',
  'Monthly',
  'Weekly',
  'Hourly'
] as const;

export const EXPERIENCE_YEARS_OPTIONS = [
  '0-1',
  '1-2',
  '2-3',
  '3-5',
  '5-7',
  '7-10',
  '10+'
] as const;

export const EXPERIENCE_LEVELS = [
  'Entry',
  'Mid',
  'Senior',
  'Executive'
] as const;

export const APPLICATION_STATUSES = [
  'New',
  'In Review',
  'Interview',
  'Offer',
  'Hired',
  'Rejected'
] as const;

export const JOB_STATUSES = [
  'draft',
  'published',
  'closed',
  'archived'
] as const;

export const PRIORITY_LEVELS = [
  'Low',
  'Medium',
  'High'
] as const;

export const APPLICATION_SOURCES = [
  'company_website',
  'linkedin',
  'indeed',
  'other'
] as const;

export const QUESTION_TYPES = [
  'text',
  'multiple-choice'
] as const;

export const JOB_BOARDS = [
  'LinkedIn',
  'Company Page',
  'Indeed',
  'Glassdoor',
  'AngelList'
] as const;

// UI Constants
export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

// Status colors for UI
export const STATUS_COLORS = {
  New: 'bg-gray-100 text-gray-800',
  'In Review': 'bg-blue-100 text-blue-800',
  Interview: 'bg-yellow-100 text-yellow-800',
  Offer: 'bg-purple-100 text-purple-800',
  Hired: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
} as const;

export const PRIORITY_COLORS = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
} as const;
