import { useState, useMemo } from 'react';
import { Student } from '../types';
import { Save, X, Calendar, User, School, AlertCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { validation } from '../lib/validation';
import { useNotification } from '../context/NotificationContext';
import { getSchools, addCustomSchool } from '../lib/schoolsList';

interface StudentFormProps {
  student?: Student;
  onSave: (student: Student) => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSave, onCancel }: StudentFormProps) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    id: student?.id || crypto.randomUUID(),
    name: student?.name || '',
    dateOfBirth: student?.dateOfBirth || '',
    schoolName: student?.schoolName || '',
    status: student?.status || 'pending' as const,
    selectedSport: student?.selectedSport || 'football' as const,
    evaluations: student?.evaluations || {},
    evaluationHistory: student?.evaluationHistory || { football: [], athletics: [] }
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isAddingSchool, setIsAddingSchool] = useState(false);
  const [newSchool, setNewSchool] = useState('');
  const schools = useMemo(() => getSchools(), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validation.validateStudent(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      showNotification('Please fix the errors before submitting', 'error');
      return;
    }

    onSave(formData);
    showNotification(
      `Student ${student ? 'updated' : 'added'} successfully`,
      'success'
    );
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleAddSchool = () => {
    if (newSchool.trim()) {
      addCustomSchool(newSchool.trim());
      setFormData({ ...formData, schoolName: newSchool.trim() });
      setNewSchool('');
      setIsAddingSchool(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 border border-red-200 rounded-md p-4"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Please fix the following errors:
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="Enter student's full name"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
                {formData.dateOfBirth && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    Age: {calculateAge(formData.dateOfBirth)} years
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <School className="h-4 w-4 mr-1" />
                School Name
              </label>
              {isAddingSchool ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter new school name"
                  />
                  <button
                    type="button"
                    onClick={handleAddSchool}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSchool(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a school</option>
                    {schools.map(school => (
                      <option key={school} value={school}>{school}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingSchool(true)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Add New School
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Trophy className="h-4 w-4 mr-1" />
                Selected Sport
              </label>
              <select
                value={formData.selectedSport}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  selectedSport: e.target.value as 'football' | 'athletics',
                  evaluations: {
                    [e.target.value]: formData.evaluations[e.target.value as 'football' | 'athletics']
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="football">Football</option>
                <option value="athletics">Athletics</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              {student ? 'Update' : 'Save'} Student
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}