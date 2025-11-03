'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCandidates, useDeleteCandidate, Candidate } from '@/hooks/useCandidates';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Pagination } from '@/components/ui/Pagination';
import { Input } from '@/components/ui/Input';
import { Search, Edit, Plus, Loader2, Trash2 } from 'lucide-react';
import { DeleteCandidateModal } from '@/components/admin/candidates/DeleteCandidateModal';

export default function AdminCandidatesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  const pageSize = 10;

  const { data: candidatesData, isLoading, refetch } = useCandidates({
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    role: 'candidate', // Only show candidates, not employees
  });

  const deleteCandidateMutation = useDeleteCandidate();

  const candidates = candidatesData?.data || [];
  const pagination = candidatesData?.pagination || { current: 1, pages: 1, total: 0 };

  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
  };

  const handleDeleteConfirm = async () => {
    if (!candidateToDelete) return;

    try {
      await deleteCandidateMutation.mutateAsync(candidateToDelete._id);
      setCandidateToDelete(null);
      refetch();
    } catch (error) {
      // Error handled by mutation's onError
    }
  };

  const handleDeleteCancel = () => {
    setCandidateToDelete(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    refetch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Add, edit, and manage candidate details.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/admin/candidates/add" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Candidate</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>
          <Link href="/admin/candidates/bulk" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Bulk Add</Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="outline" className="flex-1 sm:flex-none">
                Search
              </Button>
              {searchQuery && (
                <Button type="button" variant="outline" onClick={handleClearSearch} className="flex-1 sm:flex-none">
                  Clear
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading candidates...</span>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-500">
                {searchQuery ? 'No candidates found matching your search.' : 'No candidates yet. Add your first candidate to get started.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LinkedIn</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {candidate.firstName} {candidate.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{candidate.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{candidate.phone || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {candidate.totalExperience !== undefined ? `${candidate.totalExperience} years` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {candidate.linkedinUrl ? (
                            <a
                              href={candidate.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View Profile
                            </a>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/admin/candidates/${candidate._id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteClick(candidate)}
                              disabled={deleteCandidateMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <div key={candidate._id} className="p-4 hover:bg-gray-50">
                    <div className="space-y-3">
                      {/* Name and Actions */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {candidate.firstName} {candidate.lastName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Link href={`/admin/candidates/${candidate._id}/edit`}>
                            <Button variant="outline" size="sm" className="px-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="px-2"
                            onClick={() => handleDeleteClick(candidate)}
                            disabled={deleteCandidateMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm text-gray-900 truncate">{candidate.email}</p>
                      </div>

                      {/* Phone */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm text-gray-900">{candidate.phone || '—'}</p>
                      </div>

                      {/* Experience and LinkedIn */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Experience</p>
                          <p className="text-sm text-gray-900">
                            {candidate.totalExperience !== undefined ? `${candidate.totalExperience} years` : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
                          {candidate.linkedinUrl ? (
                            <a
                              href={candidate.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline truncate block"
                            >
                              View Profile
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-4 py-4 border-t border-gray-200">
                  <Pagination
                    currentPage={pagination.current}
                    totalPages={pagination.pages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}

              {/* Footer Stats */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} candidates
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteCandidateModal
        isOpen={!!candidateToDelete}
        candidate={candidateToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCandidateMutation.isPending}
      />
    </div>
  );
}
