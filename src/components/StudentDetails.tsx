import React, { useState } from 'react';
import { Student, SportEvaluation } from '../types';
import { FOOTBALL_METRICS, ATHLETICS_METRICS } from '../constants/evaluationMetrics';
import { EvaluationForm } from './EvaluationForm';
import { Edit2, Award, Gauge } from 'lucide-react';

interface StudentDetailsProps {
  student: Student;
  onSave: (student: Student) => void;
  onBack: () => void;
}

export function StudentDetails({ student, onSave, onBack }: StudentDetailsProps) {
  const [activeEvaluation, setActiveEvaluation] = useState<'football' | 'athletics' | null>(null);

  const handleSaveEvaluation = (sport: 'football' | 'athletics', evaluation: SportEvaluation) => {
    onSave({
      ...student,
      evaluations: {
        ...student.evaluations,
        [sport]: evaluation
      }
    });
    setActiveEvaluation(null);
  };

  const renderEvaluationCard = (
    sport: 'football' | 'athletics',
    metrics: typeof FOOTBALL_METRICS,
    icon: React.ReactNode
  ) => {
    const evaluation = student.evaluations[sport];
    const averageScore = evaluation
      ? Object.values(evaluation.scores).reduce((a, b) => a + b, 0) / Object.values(evaluation.scores).length
      : 0;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-xl font-semibold text-gray-800 capitalize">{sport}</h3>
          </div>
          <button
            onClick={() => setActiveEvaluation(sport)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
            {evaluation ? 'Edit' : 'Add'} Evaluation
          </button>
        </div>

        {evaluation ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(averageScore / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {averageScore.toFixed(1)}/10
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date(evaluation.date).toLocaleDateString()}
            </div>
            {evaluation.comments && (
              <p className="text-gray-700 text-sm">{evaluation.comments}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No evaluation yet</p>
        )}
      </div>
    );
  };

  if (activeEvaluation) {
    const metrics = activeEvaluation === 'football' ? FOOTBALL_METRICS : ATHLETICS_METRICS;
    return (
      <EvaluationForm
        sport={activeEvaluation}
        metrics={metrics}
        initialEvaluation={student.evaluations[activeEvaluation]}
        onSave={(evaluation) => handleSaveEvaluation(activeEvaluation, evaluation)}
        onCancel={() => setActiveEvaluation(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <p className="text-gray-600">{student.schoolName}</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to List
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {renderEvaluationCard('football', FOOTBALL_METRICS, <Award className="h-6 w-6 text-blue-600" />)}
        {renderEvaluationCard('athletics', ATHLETICS_METRICS, <Gauge className="h-6 w-6 text-blue-600" />)}
      </div>
    </div>
  );
}