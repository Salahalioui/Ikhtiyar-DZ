import { Student } from '../types';

export const advancedSearch = {
  byPerformance: (students: Student[], criteria: {
    sport: 'football' | 'athletics',
    minScore: number,
    maxScore: number
  }) => {
    return students.filter(student => {
      const evaluation = student.evaluations[criteria.sport];
      if (!evaluation) return false;
      
      const scores = Object.values(evaluation.scores);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      return avgScore >= criteria.minScore && avgScore <= criteria.maxScore;
    });
  },

  byAgeGroup: (students: Student[], ageGroup: string) => {
    return students.filter(student => {
      const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
      const group = `U${Math.floor(age / 2) * 2}`;
      return group === ageGroup;
    });
  },

  bySchoolPerformance: (students: Student[], schoolName: string) => {
    return students.filter(s => s.schoolName === schoolName);
  }
}; 