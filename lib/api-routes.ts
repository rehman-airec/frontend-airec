// API endpoint definitions
export const API_ROUTES = {
  // Auth endpoints
  AUTH: {
    ADMIN_SIGNUP: '/auth/admin/signup',
    ADMIN_LOGIN: '/auth/admin/login',
    CANDIDATE_SIGNUP: '/auth/candidate/signup',
    CANDIDATE_LOGIN: '/auth/candidate/login',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ADMIN_LIST: '/auth/admin/list',
  },
  
  // Job endpoints
  JOBS: {
    LIST: '/jobs',
    SEARCH: '/jobs/search',
    GET_BY_ID: (id: string) => `/jobs/${id}`,
    CREATE: '/jobs',
    UPDATE: (id: string) => `/jobs/${id}`,
    UPDATE_STEP: (id: string, step: string) => `/jobs/${id}/step/${step}`,
    PUBLISH: (id: string) => `/jobs/${id}/publish`,
    CLOSE: (id: string) => `/jobs/${id}/close`,
    ARCHIVE: (id: string) => `/jobs/${id}/archive`,
    DELETE: (id: string) => `/jobs/${id}`,
    ADMIN_JOBS: '/jobs/admin/jobs',
    ADMIN_JOB_TITLES: '/jobs/admin/job-titles',
    ADMIN_STATS: '/jobs/admin/stats',
    APPLICATIONS: (id: string) => `/jobs/${id}/applications`,
  },
  
  // Application endpoints
  APPLICATIONS: {
    APPLY: (jobId: string) => `/applications/jobs/${jobId}/apply`,
    GET_BY_ID: (id: string) => `/applications/${id}`,
    CANDIDATE_GET_BY_ID: (id: string) => `/applications/candidate/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
    ADD_NOTE: (id: string) => `/applications/${id}/note`,
    UPDATE_NOTE: (id: string, noteIndex: number) => `/applications/${id}/note/${noteIndex}`,
    BULK_UPDATE: '/applications/bulk/status',
    CANDIDATE_APPLICATIONS: '/applications/candidate/applications',
    ADMIN_STATS: '/applications/admin/stats',
    ADMIN_ANALYTICS: '/applications/admin/analytics',
  },
  
  // File endpoints
  FILES: {
    UPLOAD_RESUME: '/files/resume',
    DOWNLOAD_RESUME: (filename: string) => `/files/resume/${filename}`,
    FILE_INFO: (filename: string) => `/files/resume/${filename}/info`,
    LIST: '/files/list',
    DELETE: (filename: string) => `/files/resume/${filename}`,
  },
  
  // Profile endpoints
  PROFILE: {
    GET: '/profile/me',
    UPDATE: '/profile/me',
    STATS: '/profile/me/stats',
    UPLOAD_AVATAR: '/profile/avatar',
    DELETE_AVATAR: '/profile/avatar',
    SAVED_JOBS: '/profile/me/saved-jobs',
    SAVE_JOB: (jobId: string) => `/profile/jobs/${jobId}/save`,
    UNSAVE_JOB: (jobId: string) => `/profile/jobs/${jobId}/save`,
    CHECK_JOB_SAVED: (jobId: string) => `/profile/jobs/${jobId}/saved`,
  },

  // CV Parsing endpoints
  CV_PARSING: {
    PARSE: '/cv/parse',
    VALIDATE: '/cv/validate',
    STATS: '/cv/stats',
  },
  
  // Screening Templates endpoints
  SCREENING_TEMPLATES: {
    LIST: '/screening-templates',
    GET_BY_ID: (id: string) => `/screening-templates/${id}`,
    CREATE: '/screening-templates',
    UPDATE: (id: string) => `/screening-templates/${id}`,
    DELETE: (id: string) => `/screening-templates/${id}`,
    INCREMENT_USAGE: (id: string) => `/screening-templates/${id}/increment-usage`,
  },

  // Evaluation Templates endpoints
  EVALUATION_TEMPLATES: {
    LIST: '/evaluation-templates',
    GET_BY_ID: (templateId: string) => `/evaluation-templates/${templateId}`,
    CREATE: '/evaluation-templates',
    UPDATE: (templateId: string) => `/evaluation-templates/${templateId}`,
    DELETE: (templateId: string) => `/evaluation-templates/${templateId}`,
    INCREMENT_USAGE: (templateId: string) => `/evaluation-templates/${templateId}/increment-usage`,
  },

  // Event endpoints
  EVENTS: {
    CREATE: (applicationId: string) => `/applications/${applicationId}/events`,
    GET_BY_APPLICATION: (applicationId: string) => `/applications/${applicationId}/events`,
    GET_AVAILABLE_ATTENDEES: (applicationId: string) => `/applications/${applicationId}/events/available-attendees`,
    UPDATE: (eventId: string) => `/applications/events/${eventId}`,
    DELETE: (eventId: string) => `/applications/events/${eventId}`,
  },

  // Email Template endpoints
  EMAIL_TEMPLATES: {
    LIST: '/email-templates',
    GET_BY_ID: (id: string) => `/email-templates/${id}`,
    CREATE: '/email-templates',
    UPDATE: (id: string) => `/email-templates/${id}`,
    DELETE: (id: string) => `/email-templates/${id}`,
  },

  // Tenant endpoints (Multi-tenant support)
  TENANT: {
    LIST: '/superadmin/tenants',
    GET_BY_ID: (id: string) => `/superadmin/tenants/${id}`,
    CREATE: '/superadmin/create-tenant',
    UPDATE: (id: string) => `/superadmin/tenants/${id}`,
    DELETE: (id: string) => `/superadmin/tenants/${id}`,
    CREATE_USER: '/tenant/create-user',
    INFO: '/tenant/info',
    PUBLIC_INFO: '/tenant/public-info',
  },

  // Employee endpoints (Tenant-scoped employee management)
  EMPLOYEES: {
    LIST: '/tenant/users',
    GET_BY_ID: (id: string) => `/tenant/users/${id}`,
    CREATE: '/tenant/users',
    DELETE: (id: string) => `/tenant/users/${id}`,
    QUOTA: '/tenant/users/stats/quota',
  },

  // Candidate management endpoints (Admin)
  CANDIDATES: {
    ADD_SINGLE: '/candidates/admin/add',
    ADD_BULK: '/candidates/admin/bulk-add',
    LIST: '/candidates/admin/list',
    GET_BY_ID: (id: string) => `/candidates/admin/${id}`,
    UPDATE: (id: string) => `/candidates/admin/${id}`,
    DELETE: (id: string) => `/candidates/admin/${id}`,
  },

  // Guest application endpoints
  GUEST: {
    APPLY: (jobId: string) => `/guest/jobs/${jobId}/apply/guest`,
    TRACK: (trackingToken: string) => `/guest/track/${trackingToken}`,
    BY_EMAIL: (email: string) => `/guest/applications/${email}`,
    CONVERT_TO_USER: '/guest/convert-to-user',
  },
} as const;
