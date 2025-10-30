export interface ScreeningAnswer {
  questionId: string;
  answer: string;
}

export interface ApplicationNote {
  adminId: string;
  text: string;
  timestamp: string;
}

export interface CandidateSnapshot {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalExperience: number;
  linkedinUrl?: string;
}

export interface Application {
  _id: string;
  jobId: string;
  candidateId: string;
  status: 'New' | 'In Review' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  resumePath: string;
  resumeFilename: string;
  screeningAnswers: ScreeningAnswer[];
  notes: ApplicationNote[];
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  candidateSnapshot: CandidateSnapshot;
  priority: 'Low' | 'Medium' | 'High';
  source: 'company_website' | 'linkedin' | 'indeed' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithJob extends Application {
  job: {
    _id: string;
    title: string;
    department: string;
    location: {
      city: string;
      country: string;
    };
    employmentType: string;
    experienceLevel: string;
    description?: string;
  };
}

export interface ApplicationWithCandidate extends Application {
  candidate: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    totalExperience: number;
    linkedinUrl?: string;
  };
}

export interface ApplicationApplyRequest {
  jobId: string;
  screeningAnswers?: ScreeningAnswer[];
  source?: string;
}

export interface ApplicationStatusUpdateRequest {
  status: string;
  note?: string;
  priority?: string;
}

export interface BulkStatusUpdateRequest {
  applicationIds: string[];
  status: string;
  note?: string;
}

export interface ApplicationFilters {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface ApplicationStats {
  total: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
}

export interface ApplicationAnalytics {
  total: number;
  new: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
}
