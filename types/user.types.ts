export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'candidate' | 'superadmin' | 'recruiter' | 'employee';
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  totalExperience?: number;
  linkedinUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin extends User {
  role: 'admin' | 'superadmin';
  name: string;
}

export interface Candidate extends User {
  role: 'candidate';
  firstName: string;
  lastName: string;
  phone: string;
  totalExperience: number;
  linkedinUrl?: string;
  savedJobs: string[];
  profile: {
    avatar?: string;
    bio?: string;
    skills: string[];
    education: Education[];
    experience: Experience[];
  };
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
}
