import React, { useState } from 'react';
import { Student, SportEvaluation } from '../types';
import { FOOTBALL_METRICS, ATHLETICS_METRICS } from '../constants/evaluationMetrics';
import { EvaluationForm } from './EvaluationForm';
import { Edit2, Award, Gauge, ChevronLeft, UserCheck, UserX } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface StudentDetailsProps {
  student: Student;
  onSave: (student: Student) => void;
  onBack: () => void;
}

export function StudentDetails({ student, onSave, onBack }: StudentDetailsProps) {
  const [activeEvaluation, setActiveEvaluation] = useState<'football' | 'athletics' | null>(null);
  const { showNotification } = useNotification();

  const handleSaveEvaluation = (sport: 'football' | 'athletics', evaluation: SportEvaluation) => {
    onSave({
      ...student,
      evaluations: {
        ...student.evaluations,
        [sport]: evaluation
      }
    });
    setActiveEvaluation(null);
    showNotification(`${sport} evaluation saved successfully`, 'success');
  };

  const handleStatusChange = (newStatus: 'selected' | 'eliminated') => {
    onSave({
      ...student,
      status: newStatus
    });
    showNotification(
      `Student ${newStatus === 'selected' ? 'selected' : 'eliminated'} successfully`,
      newStatus === 'selected' ? 'success' : 'info'
    );
  };

  const renderEvaluationCard = (sport: 'football' | 'athletics', metrics: any[], icon: JSX.Element) => {
    const evaluation = student.evaluations[sport];
    const averageScore = evaluation
      ? Object.values(evaluation.scores).reduce((a, b) => a + b, 0) / Object.values(evaluation.scores).length
      : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-medium capitalize">{sport}</h3>
          </div>
          <div className="flex items-center gap-2">
            {evaluation && (
              <span className="text-sm font-medium text-gray-500">
                Average: {averageScore.toFixed(1)}
              </span>
            )}
            <button
              onClick={() => setActiveEvaluation(sport)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
            >
              {evaluation ? 'Edit' : 'Add'} Evaluation
            </button>
          </div>
        </div>

        {evaluation ? (
          <div className="space-y-4">
            {metrics.map(metric => (
              <div key={metric.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{metric.name}</span>
                  <span className="text-gray-500">{evaluation.scores[metric.id]}/{metric.max}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{
                      width: `${(evaluation.scores[metric.id] / metric.max) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
            {evaluation.comments && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">{evaluation.comments}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No evaluation yet</p>
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
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-600">{student.schoolName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusChange('selected')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              student.status === 'selected'
                ? 'bg-green-600 text-white'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            <UserCheck className="h-5 w-5" />
            Select
          </button>
          <button
            onClick={() => handleStatusChange('eliminated')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              student.status === 'eliminated'
                ? 'bg-red-600 text-white'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <UserX className="h-5 w-5" />
            Eliminate
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {renderEvaluationCard('football', FOOTBALL_METRICS, <Award className="h-6 w-6 text-blue-600" />)}
        {renderEvaluationCard('athletics', ATHLETICS_METRICS, <Gauge className="h-6 w-6 text-blue-600" />)}
      </div>
    </div>
  );
}