import { Student } from '../types';

export const statistics = {
  getSchoolStats: (students: Student[]) => {
    const stats: Record<string, {
      total: number;
      selected: number;
      eliminated: number;
      football: number;
      athletics: number;
    }> = {};

    students.forEach(student => {
      if (!stats[student.schoolName]) {
        stats[student.schoolName] = {
          total: 0,
          selected: 0,
          eliminated: 0,
          football: 0,
          athletics: 0
        };
      }

      stats[student.schoolName].total++;
      if (student.status === 'selected') stats[student.schoolName].selected++;
      if (student.status === 'eliminated') stats[student.schoolName].eliminated++;
      if (student.selectedSport === 'football') stats[student.schoolName].football++;
      if (student.selectedSport === 'athletics') stats[student.schoolName].athletics++;
    });

    return stats;
  },

  getAgeGroupStats: (students: Student[]) => {
    const stats: Record<string, number> = {};
    students.forEach(student => {
      const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
      const group = `U${Math.floor(age / 2) * 2}`;
      stats[group] = (stats[group] || 0) + 1;
    });
    return stats;
  },

  getSelectionStats: (students: Student[]) => {
    return {
      total: students.length,
      selected: students.filter(s => s.status === 'selected').length,
      eliminated: students.filter(s => s.status === 'eliminated').length,
      pending: students.filter(s => s.status === 'pending').length
    };
  }
}; 