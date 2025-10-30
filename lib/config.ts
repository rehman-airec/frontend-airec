// Configuration for API endpoints
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
};

// Helper function to get full file URL
export const getFileUrl = (path: string) => {
  return `${API_CONFIG.BACKEND_URL}${path}`;
};
