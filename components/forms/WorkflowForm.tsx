'use client';

import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Plus, X } from 'lucide-react';
import { useAdmins } from '@/hooks/useAdmins';
import { EvaluationTemplateSelector } from './EvaluationTemplateSelector';

const workflowSchema = z.object({
  hiringTeam: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    role: z.string().min(1, 'Role is required'),
  })),
  workflow: z.array(z.string()).min(1, 'At least one workflow step is required'),
  evaluationTemplateId: z.string().optional(),
});

type WorkflowFormData = z.infer<typeof workflowSchema>;

interface WorkflowFormProps {
  initialData?: Partial<WorkflowFormData>;
  onSubmit: (data: WorkflowFormData) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
  showPublishOption?: boolean;
}

const WorkflowForm: React.FC<WorkflowFormProps> = ({
  initialData,
  onSubmit,
  onNext,
  onBack,
  isLoading = false,
  isEdit = false,
  showPublishOption = true,
}) => {
  const { data: admins = [], isLoading: adminsLoading } = useAdmins();
  const [hiringTeam, setHiringTeam] = React.useState(
    initialData?.hiringTeam || []
  );
  const [workflow, setWorkflow] = React.useState(
    initialData?.workflow || ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected']
  );
  const [evaluationTemplateId, setEvaluationTemplateId] = React.useState(
    initialData?.evaluationTemplateId || null
  );

  const allStatuses = React.useMemo(
    () => [
      'New',
      'Selected',
      'In Review',
      'Interview',
      'Offer',
      'Hired',
      'Rejected',
      'Decision Pending',
      'Saved for Future',
      'Out of Budget',
      'Shortlisted',
    ],
    []
  );

  // Update state when initialData changes (for edit mode)
  React.useEffect(() => {
    if (initialData && isEdit) {
      setHiringTeam(initialData.hiringTeam || []);
      setWorkflow(initialData.workflow || ['New', 'In Review', 'Interview', 'Offer', 'Hired', 'Rejected']);
    }
  }, [initialData, isEdit]);

  const addTeamMember = () => {
    setHiringTeam([
      ...hiringTeam,
      { name: '', email: '', role: '' },
    ]);
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updated = [...hiringTeam];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-populate email when name is selected
    if (field === 'name' && value) {
      const selectedAdmin = admins.find(admin => admin.name === value || admin._id === value);
      if (selectedAdmin) {
        updated[index].email = selectedAdmin.email;
      }
    }
    
    setHiringTeam(updated);
  };

  // Prepare admin options for dropdown
  const adminOptions = admins.map(admin => ({
    value: admin._id,
    label: `${admin.name}${admin.email ? ` (${admin.email})` : ''}`
  }));

  // Helper to get admin name by ID
  const getAdminNameById = (adminId: string) => {
    const admin = admins.find(a => a._id === adminId);
    return admin?.name || '';
  };

  const removeTeamMember = (index: number) => {
    setHiringTeam(hiringTeam.filter((_, i) => i !== index));
  };

  const addWorkflowStep = () => {
    setWorkflow([...workflow, '']);
  };

  const updateWorkflowStep = (index: number, value: string) => {
    const updated = [...workflow];
    updated[index] = value;
    setWorkflow(updated);
  };

  const removeWorkflowStep = (index: number) => {
    setWorkflow(workflow.filter((_, i) => i !== index));
  };

  const addStatusToWorkflow = (status: string) => {
    if (!workflow.includes(status)) {
      setWorkflow([...workflow, status]);
    }
  };

  const handleSubmit = () => {
    onSubmit({ 
      hiringTeam, 
      workflow,
      evaluationTemplateId: evaluationTemplateId || undefined
    });
    onNext();
  };

  // Update evaluation template ID when initialData changes
  React.useEffect(() => {
    if (initialData && isEdit) {
      setEvaluationTemplateId(initialData.evaluationTemplateId || null);
    }
  }, [initialData, isEdit]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Workflow & Team</h2>
        <p className="text-gray-600">Configure the hiring process and team members</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Hiring Team */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Hiring Team</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTeamMember}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>

            <div className="space-y-4">
              {hiringTeam.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Team Member {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      label="Name"
                      placeholder={adminsLoading ? "Loading admins..." : "Select team member"}
                      value={(() => {
                        if (!member.name) return '';
                        // Try to find admin by name first, then by checking if any admin matches
                        const foundAdmin = admins.find(a => a.name === member.name);
                        return foundAdmin?._id || '';
                      })()}
                      onChange={(e) => {
                        const selectedAdminId = e.target.value;
                        if (!selectedAdminId) {
                          // Clear selection
                          updateTeamMember(index, 'name', '');
                          updateTeamMember(index, 'email', '');
                          return;
                        }
                        const selectedAdmin = admins.find(a => a._id === selectedAdminId);
                        if (selectedAdmin) {
                          updateTeamMember(index, 'name', selectedAdmin.name);
                        }
                      }}
                      options={[
                        { value: '', label: 'Select team member' },
                        ...adminOptions
                      ]}
                      disabled={adminsLoading}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Auto-populated when name selected"
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      readOnly={!!member.name && admins.some(a => a.name === member.name)}
                      className={!!member.name && admins.some(a => a.name === member.name) ? 'bg-gray-50' : ''}
                    />
                    <Input
                      label="Role"
                      placeholder="e.g. Hiring Manager"
                      value={member.role}
                      onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interviewer Evaluation Template */}
          <div>
            <EvaluationTemplateSelector
              selectedTemplateId={evaluationTemplateId || undefined}
              onTemplateSelect={setEvaluationTemplateId}
            />
          </div>

          {/* Status Bank (Horizontal) */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Available Statuses</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1" role="list" aria-label="Available statuses">
              {allStatuses.map((status) => {
                const inWorkflow = workflow.includes(status);
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => addStatusToWorkflow(status)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ` +
                      (inWorkflow
                        ? 'border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')}
                    aria-pressed={inWorkflow}
                    title={status}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workflow Steps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Application Workflow</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWorkflowStep}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {workflow.map((step, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 w-8 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <Input
                    value={step}
                    onChange={(e) => updateWorkflowStep(index, e.target.value)}
                    placeholder="e.g. Phone Screen"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkflowStep(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} loading={isLoading}>
              Continue to Publish
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { WorkflowForm };
