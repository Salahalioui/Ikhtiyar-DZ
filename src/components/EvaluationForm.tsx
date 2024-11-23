import React, { useState } from 'react';
import { EvaluationMetric, SportEvaluation } from '../types';
import { Save, X } from 'lucide-react';

interface EvaluationFormProps {
  metrics: EvaluationMetric[];
  initialEvaluation?: SportEvaluation;
  onSave: (evaluation: SportEvaluation) => void;
  onCancel: () => void;
  sport: string;
}

export function EvaluationForm({
  metrics,
  initialEvaluation,
  onSave,
  onCancel,
  sport
}: EvaluationFormProps) {
  const [scores, setScores] = useState<Record<string, number>>(
    initialEvaluation?.scores || {}
  );
  const [comments, setComments] = useState(initialEvaluation?.comments || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all metrics have been scored
    const hasAllScores = metrics.every(metric => 
      scores[metric.id] !== undefined && scores[metric.id] > 0
    );
    
    if (!hasAllScores) {
      alert('Please provide scores for all metrics');
      return;
    }
    
    onSave({
      date: initialEvaluation?.date || new Date().toISOString(),
      scores,
      comments
    });
  };

  const handleScoreChange = (metricId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [metricId]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {sport} Evaluation
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                {metric.name}
                <span className="ml-2 text-gray-500 text-xs">
                  {metric.description}
                </span>
              </label>
              <span className="text-sm font-medium text-blue-600">
                {scores[metric.id] || 0}/{metric.max}
              </span>
            </div>
            <input
              type="range"
              min={metric.min}
              max={metric.max}
              value={scores[metric.id] || 0}
              onChange={(e) => handleScoreChange(metric.id, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            Save Evaluation
          </button>
        </div>
      </div>
    </form>
  );
}