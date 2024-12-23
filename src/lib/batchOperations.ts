import { Student, SportEvaluation } from '../types';
import { storage } from './storage';

export const batchOperations = {
  updateStatus: (studentIds: string[], newStatus: Student['status']) => {
    const students = storage.getStudents();
    const updated = students.map(student => {
      if (studentIds.includes(student.id)) {
        return {
          ...student,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString()
        };
      }
      return student;
    });
    storage.saveStudents(updated);
  },

  deleteMultiple: (studentIds: string[]) => {
    const students = storage.getStudents();
    const remaining = students.filter(student => !studentIds.includes(student.id));
    storage.saveStudents(remaining);
  },

  getStatusHistory: (studentId: string): Array<{ status: Student['status']; timestamp: string }> => {
    const students = storage.getStudents();
    const student = students.find(s => s.id === studentId);
    return student?.statusHistory || [];
  },

  validateStatusChange: (student: Student, newStatus: Student['status']): boolean => {
    if (student.status === 'eliminated' && newStatus === 'selected') {
      return false;
    }
    return true;
  },

  updateEvaluations: (evaluations: { studentId: string; evaluation: SportEvaluation }[]) => {
    const students = storage.getStudents();
    const updated = students.map(student => {
      const studentEvaluation = evaluations.find(e => e.studentId === student.id);
      if (studentEvaluation) {
        return {
          ...student,
          evaluations: {
            // Only keep the evaluation for the selected sport
            [student.selectedSport]: {
              ...studentEvaluation.evaluation,
              date: new Date().toISOString()
            }
          }
        };
      }
      return student;
    });
    storage.saveStudents(updated);
  }
}; 