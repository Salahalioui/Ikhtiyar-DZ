import { useState, useMemo } from 'react';
import { Student, SportEvaluation } from '../types';
import { config } from '../lib/config';
import { Save, X, Filter, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

interface BatchEvaluationProps {
  students: Student[];
  onSave: (evaluations: { studentId: string; evaluation: SportEvaluation }[]) => void;
  onClose: () => void;
}

export function BatchEvaluation({ students, onSave, onClose }: BatchEvaluationProps) {
  const { showNotification } = useNotification();
  const [selectedSport, setSelectedSport] = useState<'football' | 'athletics'>('football');
  const [filters, setFilters] = useState({
    school: 'all',
    ageGroup: 'all',
    status: 'all' as 'all' | 'pending' | 'selected' | 'eliminated'
  });
  const [evaluations, setEvaluations] = useState<Record<string, Record<string, number>>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const metrics = config.getMetrics(selectedSport);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSchool = filters.school === 'all' || student.schoolName === filters.school;
      const matchesStatus = filters.status === 'all' || student.status === filters.status;
      // Only show students who have selected this sport
      return matchesSchool && matchesStatus && student.selectedSport === selectedSport;
    });
  }, [students, filters, selectedSport]);

  const schools = useMemo(() => {
    return ['all', ...new Set(students.map(s => s.schoolName))];
  }, [students]);

  const handleScoreChange = (studentId: string, metricId: string, value: string) => {
    const numValue = Number(value);
    const metric = metrics.find(m => m.id === metricId);
    
    if (!metric || numValue < metric.min || numValue > metric.max) return;

    setEvaluations(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [metricId]: numValue
      }
    }));
  };

  const handleSave = () => {
    const evaluationsToSave = Object.entries(evaluations).map(([studentId, scores]) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return null;

      return {
        studentId,
        evaluation: {
          date: new Date().toISOString(),
          scores,
          comments: comments[studentId] || '',
          // Add sport-specific metadata if needed
          sport: student.selectedSport
        }
      };
    }).filter((e): e is NonNullable<typeof e> => e !== null);

    if (evaluationsToSave.length === 0) {
      showNotification('No evaluations to save', 'error');
      return;
    }

    onSave(evaluationsToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Batch Evaluation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value as 'football' | 'athletics')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="football">Football</option>
                <option value="athletics">Athletics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
              <select
                value={filters.school}
                onChange={(e) => setFilters({ ...filters, school: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {schools.map(school => (
                  <option key={school} value={school}>
                    {school === 'all' ? 'All Schools' : school}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as typeof filters.status })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="selected">Selected</option>
                <option value="eliminated">Eliminated</option>
              </select>
            </div>
          </div>

          {/* Evaluation Grid */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  {metrics.map(metric => (
                    <th key={metric.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {metric.name}
                      <div className="text-xs font-normal text-gray-400 normal-case">
                        ({metric.min}-{metric.max})
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.schoolName}</div>
                      </div>
                    </td>
                    {metrics.map(metric => (
                      <td key={metric.id} className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min={metric.min}
                          max={metric.max}
                          value={evaluations[student.id]?.[metric.id] || ''}
                          onChange={(e) => handleScoreChange(student.id, metric.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={comments[student.id] || ''}
                        onChange={(e) => setComments(prev => ({
                          ...prev,
                          [student.id]: e.target.value
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        placeholder="Add comments..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your filters or select a different sport.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Evaluations
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 