import { Student, SportEvaluation } from '../types';

export const validation = {
  validateStudent: (student: Partial<Student>): string[] => {
    const errors: string[] = [];
    if (!student.name?.trim()) errors.push('Name is required');
    if (!student.dateOfBirth) errors.push('Date of birth is required');
    if (!student.schoolName?.trim()) errors.push('School name is required');
    if (!student.selectedSport) errors.push('Sport selection is required');
    
    if (student.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
      if (age < 8 || age > 18) errors.push('Age must be between 8 and 18');
    }
    
    return errors;
  },

  validateEvaluation: (evaluation: Partial<SportEvaluation>): string[] => {
    const errors: string[] = [];
    if (!evaluation.scores || Object.keys(evaluation.scores).length === 0) {
      errors.push('At least one score is required');
    }
    return errors;
  }
}; 