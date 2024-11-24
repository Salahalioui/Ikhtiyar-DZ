import { Student } from '../types';

export interface SearchFilters {
  ageRange: [number, number];
  performance: {
    metric: string;
    min: number;
    max: number;
  }[];
  location: string[];
  dateRange: [Date, Date];
}

export const searchStudents = (students: Student[], filters: SearchFilters) => {
  return students.filter(student => {
    // Age range filter
    const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
    if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;

    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(student.schoolName)) return false;

    // Performance filter
    const meetsPerformance = filters.performance.every(({ metric, min, max }) => {
      const evaluation = student.evaluations[student.selectedSport];
      if (!evaluation) return false;
      const score = evaluation.scores[metric];
      return score >= min && score <= max;
    });

    if (!meetsPerformance) return false;

    // Date range filter
    const studentDate = new Date(student.dateOfBirth);
    return studentDate >= filters.dateRange[0] && studentDate <= filters.dateRange[1];
  });
}; 