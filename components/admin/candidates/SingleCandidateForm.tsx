'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Upload, User, Phone, Mail, Briefcase, Link2 } from 'lucide-react';
import { TextInput } from '@/components/candidate/TextInput';
import { FileUpload } from '@/components/candidate/FileUpload';
import { PositionSelect } from '@/components/candidate/PositionSelect';
import { useCandidate, useUpdateCandidate, Candidate } from '@/hooks/useCandidates';

interface SingleCandidateFormProps {
  candidateId?: string;
}

export const SingleCandidateForm: React.FC<SingleCandidateFormProps> = ({ candidateId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!candidateId;
  
  // Fetch candidate data if editing
  const { data: candidateData, isLoading: isLoadingCandidate } = useCandidate(candidateId ?? null);
  const updateCandidateMutation = useUpdateCandidate();
  
  const [form, setForm] = React.useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    positionTitle: '',
    experience: '',
    linkedinUrl: '',
  });
  const [resume, setResume] = React.useState<File | null>(null);
  const [coverLetter, setCoverLetter] = React.useState<File | null>(null);

  // Load candidate data when editing
  React.useEffect(() => {
    if (isEditMode && candidateData?.data) {
      const candidate = candidateData.data;
      setForm({
        firstName: candidate.firstName || '',
        lastName: candidate.lastName || '',
        email: candidate.email || '',
        phone: candidate.phone || '',
        positionTitle: '', // Not stored in candidate model
        experience: candidate.totalExperience?.toString() || '',
        linkedinUrl: candidate.linkedinUrl || '',
      });
    }
  }, [isEditMode, candidateData]);

  // Redirect after successful update
  React.useEffect(() => {
    if (updateCandidateMutation.isSuccess) {
      router.push('/admin/candidates');
    }
  }, [updateCandidateMutation.isSuccess, router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const addCandidateMutation = useMutation({
    mutationFn: async (fd: FormData) => {
      const response = await api.post(API_ROUTES.CANDIDATES.ADD_SINGLE, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Candidate added successfully');
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setForm({ firstName: '', lastName: '', email: '', phone: '', positionTitle: '', experience: '', linkedinUrl: '' });
      setResume(null);
      setCoverLetter(null);
      router.push('/admin/candidates');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add candidate');
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && candidateId) {
      // Update existing candidate
      updateCandidateMutation.mutate({
        id: candidateId,
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          experience: form.experience ? Number(form.experience) : undefined,
          linkedinUrl: form.linkedinUrl,
        },
        files: {
          resume: resume || undefined,
          coverLetter: coverLetter || undefined,
        },
      });
      
      // Note: Redirect will happen in useEffect after mutation succeeds
    } else {
      // Add new candidate
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v || '')));
      if (resume) fd.append('resume', resume);
      if (coverLetter) fd.append('coverLetter', coverLetter);
      addCandidateMutation.mutate(fd);
    }
  };

  if (isEditMode && isLoadingCandidate) {
    return (
      <Card className="shadow">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow">
      <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Candidate Details</h2>
              <p className="text-sm text-gray-600">
                {isEditMode ? 'Update candidate information' : 'Upload documents and fill in candidate information'}
              </p>
            </div>
            <Badge variant={isEditMode ? "warning" : "info"}>
              {isEditMode ? 'Edit Mode' : 'Single Entry'}
            </Badge>
          </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <form className="space-y-8" onSubmit={onSubmit}>
          {/* Resume */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Upload className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900">Resume</h3>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <FileUpload label="CV / Resume (PDF)" accept="application/pdf" onFile={setResume} description="PDF will be parsed to extract candidate details automatically." />
            </div>
          </section>

          {/* Cover Letter */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Upload className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900">Cover Letter</h3>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <FileUpload label="Cover Letter (optional)" onFile={setCoverLetter} description="Attach a supporting cover letter (optional)." />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="First Name" name="firstName" value={form.firstName} onChange={onChange} />
              <TextInput label="Last Name" name="lastName" value={form.lastName} onChange={onChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                <div className="relative">
                  <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-9" />
                  <TextInput label="Phone Number (+92 format)" name="phone" value={form.phone} onChange={onChange} placeholder="+92xxxxxxxxxx" className="pl-9" />
                </div>
                <div className="relative">
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-9" />
                  <TextInput label="Email" type="email" name="email" value={form.email} onChange={onChange} className="pl-9" />
                </div>
              </div>
              <div className="relative md:col-span-2">
                <Link2 className="h-4 w-4 text-gray-400 absolute left-3 top-9" />
                <TextInput label="LinkedIn Profile" name="linkedinUrl" value={form.linkedinUrl} onChange={onChange} placeholder="https://www.linkedin.com/in/username" className="pl-9" />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-900">Position & Experience</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PositionSelect value={form.positionTitle} onChange={(v)=>setForm((f:any)=>({...f, positionTitle: v}))} />
              <TextInput label="Experience (years)" name="experience" type="number" min={0} max={50} value={form.experience} onChange={onChange} />
            </div>
          </section>

          <div className="pt-2">
            <Button 
              type="submit" 
              loading={isEditMode ? updateCandidateMutation.isPending : addCandidateMutation.isPending}
            >
              {isEditMode ? 'Update Candidate' : 'Add Candidate'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};


