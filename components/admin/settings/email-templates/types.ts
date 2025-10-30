export interface EmailTemplateFormData {
  subject: string;
  body: string;
  description: string;
  category: 'event' | 'interview' | 'general';
  isActive: boolean;
}

export interface TemplateVariable {
  label: string;
  value: string;
}

