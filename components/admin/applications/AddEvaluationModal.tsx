'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WysiwygEditor } from '@/components/ui/WysiwygEditor';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { X, Plus, Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvaluation: (evaluationData: any) => void;
  applicationId: string;
  evaluation?: any; // If provided, modal is in edit mode
}

interface EvaluationData {
  strengths: string;
  areasOfInterest: string;
  overallRating: number;
  recommendation: string;
  additionalNotes: string;
}

const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({
  isOpen,
  onClose,
  onAddEvaluation,
  applicationId,
  evaluation
}) => {
  const isEditMode = !!evaluation;
  
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    strengths: evaluation?.strengths || '',
    areasOfInterest: evaluation?.areasOfInterest || '',
    overallRating: evaluation?.overallRating || 0,
    recommendation: evaluation?.recommendation || '',
    additionalNotes: evaluation?.additionalNotes || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reset form when evaluation prop changes
  React.useEffect(() => {
    if (evaluation) {
      setEvaluationData({
        strengths: evaluation.strengths || '',
        areasOfInterest: evaluation.areasOfInterest || '',
        overallRating: evaluation.overallRating || 0,
        recommendation: evaluation.recommendation || '',
        additionalNotes: evaluation.additionalNotes || ''
      });
    }
  }, [evaluation]);

  const ratingOptions = [
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Below Average' },
    { value: '3', label: '3 - Average' },
    { value: '4', label: '4 - Good' },
    { value: '5', label: '5 - Excellent' },
  ];

  const recommendationOptions = [
    { value: 'hire', label: 'Hire' },
    { value: 'maybe', label: 'Maybe' },
    { value: 'no_hire', label: 'No Hire' },
    { value: 'strong_hire', label: 'Strong Hire' },
  ];

  const handleInputChange = (field: keyof EvaluationData, value: any) => {
    setEvaluationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!evaluationData.strengths.trim() || !evaluationData.areasOfInterest.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onAddEvaluation({
        ...evaluationData,
        applicationId
      });
      onClose();
      // Reset form
      setEvaluationData({
        strengths: '',
        areasOfInterest: '',
        overallRating: 0,
        recommendation: '',
        additionalNotes: ''
      });
    } catch (error) {
      console.error('Failed to add evaluation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setEvaluationData({
      strengths: '',
      areasOfInterest: '',
      overallRating: 0,
      recommendation: '',
      additionalNotes: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Evaluation' : 'Add Evaluation'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Rating & Recommendation */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Rating & Recommendation
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <Select
                    value={evaluationData.overallRating.toString()}
                    onChange={(e) => handleInputChange('overallRating', parseInt(e.target.value))}
                    options={ratingOptions}
                  />
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendation
                  </label>
                  <Select
                    value={evaluationData.recommendation}
                    onChange={(e) => handleInputChange('recommendation', e.target.value)}
                    options={recommendationOptions}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Additional Notes
                </h3>
              </CardHeader>
              <CardContent>
                <WysiwygEditor
                  value={evaluationData.additionalNotes}
                  onChange={(value) => handleInputChange('additionalNotes', value)}
                  placeholder="Add any additional notes or comments..."
                  minHeight={120}
                  maxHeight={200}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Feedback */}
          <div className="space-y-6">
            {/* Strengths */}
            <Card>
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ThumbsUp className="h-5 w-5 mr-2 text-green-600" />
                  Strengths
                </h3>
              </CardHeader>
              <CardContent>
                <WysiwygEditor
                  value={evaluationData.strengths}
                  onChange={(value) => handleInputChange('strengths', value)}
                  placeholder="Describe the candidate's strengths..."
                  minHeight={150}
                  maxHeight={250}
                />
              </CardContent>
            </Card>

            {/* Areas of Interest */}
            <Card>
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ThumbsDown className="h-5 w-5 mr-2 text-orange-600" />
                  Areas of Interest
                </h3>
              </CardHeader>
              <CardContent>
                <WysiwygEditor
                  value={evaluationData.areasOfInterest}
                  onChange={(value) => handleInputChange('areasOfInterest', value)}
                  placeholder="Describe areas of interest or improvement..."
                  minHeight={150}
                  maxHeight={250}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!evaluationData.strengths.trim() || !evaluationData.areasOfInterest.trim()}
          >
            {isEditMode ? 'Update Evaluation' : 'Add Evaluation'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { AddEvaluationModal };
