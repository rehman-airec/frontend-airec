export const calculateEndTime = (startTime: string): string => {
  if (!startTime) return '';
  
  const [hours, minutes] = startTime.split(':').map(Number);
  let endHours = hours + 1;
  if (endHours >= 24) endHours = 0;
  
  return `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

