'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface QuestionnaireProps {
  questions: any[];
  jobQuestions: any[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, jobQuestions }) => {
  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No questionnaire responses available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Screening Questions</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((answer, index) => (
            <div key={index} className="border-b pb-4 last:border-0">
              <h3 className="font-medium text-gray-900 mb-2">
                Q{index + 1}: {answer.question}
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{answer.answer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { Questionnaire };
