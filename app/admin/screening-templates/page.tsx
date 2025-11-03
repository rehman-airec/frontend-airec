'use client';

import React, { useState } from 'react';
import { useScreeningTemplates, useDeleteScreeningTemplate, ScreeningTemplate } from '@/hooks/useScreeningTemplates';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TemplateCard } from '@/components/admin/screening-templates/TemplateCard';
import { ViewTemplateModal } from '@/components/admin/screening-templates/ViewTemplateModal';
import { CreateTemplateModal } from '@/components/admin/screening-templates/CreateTemplateModal';
import { TemplateCardSkeleton } from '@/components/ui/Skeleton';
import { Plus, Search, BookOpen } from 'lucide-react';

const AdminScreeningTemplatesPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState(''); // What user types
  const [searchQuery, setSearchQuery] = useState(''); // What's actually used for searching
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ScreeningTemplate | null>(null);
  
  const { data: templatesData, isLoading } = useScreeningTemplates({ 
    search: searchQuery,
    includeDefaults: true
  });
  
  const deleteTemplate = useDeleteScreeningTemplate();
  
  const templates = templatesData?.templates || [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screening Question Templates</h1>
            <p className="text-gray-600 mt-1">Save and reuse common screening questions</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search templates by name, description, or questions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(searchInput);
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => setSearchQuery(searchInput)}
                variant="outline"
              >
                Search
              </Button>
              {searchInput && (
                <Button
                  onClick={() => {
                    setSearchInput('');
                    setSearchQuery('');
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Found</h3>
              <p className="text-gray-600 mb-6">
                Create your first screening question template to get started
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: ScreeningTemplate) => (
              <TemplateCard
                key={template._id}
                template={template}
                onView={(template) => setSelectedTemplate(template)}
                onEdit={(template) => {
                  setShowCreateModal(true);
                  setSelectedTemplate(template);
                }}
                onDelete={(template) => handleDelete(template._id)}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <CreateTemplateModal
            isOpen={showCreateModal}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedTemplate(null);
            }}
            template={selectedTemplate}
          />
        )}

        {/* View Questions Modal */}
        {selectedTemplate && !showCreateModal && (
          <ViewTemplateModal
            isOpen={!!selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            template={selectedTemplate}
          />
        )}
      </div>
    </div>
  );
};

export default AdminScreeningTemplatesPage;


