export const getRecommendationLabel = (recommendation: string): string => {
  const labels: Record<string, string> = {
    'strong_hire': 'Strong Hire',
    'hire': 'Hire',
    'maybe': 'Maybe',
    'no_hire': 'No Hire'
  };
  return labels[recommendation] || recommendation;
};

export const getRecommendationColor = (
  recommendation: string
): 'success' | 'warning' | 'danger' | 'info' => {
  const colors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    'strong_hire': 'success',
    'hire': 'success',
    'maybe': 'warning',
    'no_hire': 'danger'
  };
  return colors[recommendation] || 'info';
};

export const isEvaluationEdited = (evaluation: any): boolean => {
  return !!evaluation.editedAt;
};

export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').trim();
};

