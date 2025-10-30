'use client';

import React from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Upload, User, Phone, Mail, Briefcase, Link2 } from 'lucide-react';
import { TextInput } from '@/components/candidate/TextInput';
import { FileUpload } from '@/components/candidate/FileUpload';
import { PositionSelect } from '@/components/candidate/PositionSelect';

export const SingleCandidateForm: React.FC = () => {
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
  const [loading, setLoading] = React.useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v || '')));
      if (resume) fd.append('resume', resume);
      if (coverLetter) fd.append('coverLetter', coverLetter);

      await api.post('/candidates/admin/add', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Candidate added successfully');
      setForm({ firstName: '', lastName: '', email: '', phone: '', positionTitle: '', experience: '', linkedinUrl: '' });
      setResume(null);
      setCoverLetter(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Candidate Details</h2>
            <p className="text-sm text-gray-600">Upload documents and fill in candidate information</p>
          </div>
          <Badge variant="info">Single Entry</Badge>
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
            <Button type="submit" loading={loading}>Add Candidate</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};


