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
      <div className="text-center mb-6 pb-4 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-600">مديرية التربية لولاية البيض</div>
        <div className="text-sm text-gray-600 mb-4">الرابطة الولائية المدرسية</div>
        <h2 className="text-2xl font-bold text-gray-800">
          {sport === 'football' ? 'كرة القدم' : 'ألعاب القوى'} - تقييم المواهب
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {metric.name}
                  <p className="text-xs text-gray-500 mt-1">
                    {metric.description}
                  </p>
                </label>
                <span className="text-lg font-semibold text-blue-600">
                  {scores[metric.id] || 0}/{metric.max}
                </span>
              </div>
              
              <input
                type="range"
                min={metric.min}
                max={metric.max}
                value={scores[metric.id] || 0}
                onChange={(e) => handleScoreChange(metric.id, Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>ضعيف</span>
                <span>متوسط</span>
                <span>ممتاز</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات المقيم
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            dir="rtl"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={20} />
            حفظ التقييم
          </button>
        </div>
      </div>
    </form>
  );
}