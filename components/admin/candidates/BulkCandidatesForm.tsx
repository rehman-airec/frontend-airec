'use client';

import React from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Upload } from 'lucide-react';
import { TextInput } from '@/components/candidate/TextInput';
import { FileUpload } from '@/components/candidate/FileUpload';
import { PositionSelect } from '@/components/candidate/PositionSelect';

type CandidateEntry = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  linkedinUrl: string;
  positionTitle: string;
  resume?: File | null;
  coverLetter?: File | null;
};

export const BulkCandidatesForm: React.FC = () => {
  const [positionTitle, setPositionTitle] = React.useState('');
  const [entries, setEntries] = React.useState<CandidateEntry[]>([
    { firstName: '', lastName: '', email: '', phone: '', experience: '', linkedinUrl: '', positionTitle: '' },
  ]);
  const [loading, setLoading] = React.useState(false);

  const addRow = () => setEntries((arr) => [...arr, { firstName: '', lastName: '', email: '', phone: '', experience: '', linkedinUrl: '', positionTitle: '' }]);
  const removeRow = (idx: number) => setEntries((arr) => arr.filter((_, i) => i !== idx));
  const updateField = (idx: number, key: keyof CandidateEntry, value: any) => {
    setEntries((arr) => arr.map((e, i) => (i === idx ? { ...e, [key]: value } : e)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      const payload = entries.map((e) => ({ ...e, positionTitle }));
      fd.append('candidates', JSON.stringify(payload));
      entries.forEach((e, i) => {
        if (e.resume) fd.append(`resume_${i}`, e.resume);
        if (e.coverLetter) fd.append(`coverLetter_${i}`, e.coverLetter);
      });
      await api.post('/candidates/admin/bulk-add', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Bulk candidates processed');
      setEntries([{ firstName: '', lastName: '', email: '', phone: '', experience: '', linkedinUrl: '', positionTitle: '' }]);
      setPositionTitle('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to process bulk candidates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Candidates</h2>
            <p className="text-sm text-gray-600">Attach PDFs and details for each candidate</p>
          </div>
          <Badge variant="info">Bulk</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <PositionSelect value={positionTitle} onChange={setPositionTitle} />
            <p className="mt-2 text-xs text-gray-500">Choose the job/position these candidates are being added for.</p>
          </div>
          <div className="space-y-6">
            {entries.map((e, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Candidate {idx + 1}</h3>
                  </div>
                  <div className="space-x-2">
                    {entries.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => removeRow(idx)}>Delete</Button>
                    )}
                    <Button type="button" variant="outline" onClick={addRow}>Add</Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resume</h4>
                    <FileUpload label="Resume (PDF)" accept="application/pdf" onFile={(f)=>updateField(idx,'resume',f)} description="PDF will be parsed to extract candidate details automatically." />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Cover Letter</h4>
                    <FileUpload label="Cover Letter (optional)" onFile={(f)=>updateField(idx,'coverLetter',f)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput label="First Name" name={`firstName_${idx}`} value={e.firstName} onChange={(ev) => updateField(idx, 'firstName', ev.target.value)} />
                    <TextInput label="Last Name" name={`lastName_${idx}`} value={e.lastName} onChange={(ev) => updateField(idx, 'lastName', ev.target.value)} />
                    <TextInput label="Email" type="email" name={`email_${idx}`} value={e.email} onChange={(ev) => updateField(idx, 'email', ev.target.value)} />
                    <TextInput label="Phone Number" name={`phone_${idx}`} value={e.phone} onChange={(ev) => updateField(idx, 'phone', ev.target.value)} placeholder="+92xxxxxxxxxx" />
                    <TextInput label="Experience (years)" type="number" name={`experience_${idx}`} min={0} max={50} value={e.experience} onChange={(ev) => updateField(idx, 'experience', ev.target.value)} />
                    <TextInput label="LinkedIn Profile" name={`linkedin_${idx}`} value={e.linkedinUrl} onChange={(ev) => updateField(idx, 'linkedinUrl', ev.target.value)} placeholder="https://www.linkedin.com/in/username" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <Button type="submit" loading={loading}>Submit Bulk</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};


