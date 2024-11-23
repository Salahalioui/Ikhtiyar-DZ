import { Student } from '../types';

interface RankingOptions {
  sport?: 'football' | 'athletics' | 'overall';
  schoolFilter?: string;
  ageMin?: number;
  ageMax?: number;
}

export const rankings = {
  calculateStudentScore: (student: Student, sport?: 'football' | 'athletics'): number => {
    if (sport) {
      const evaluation = student.evaluations[sport];
      if (!evaluation) return 0;
      return Object.values(evaluation.scores).reduce((a, b) => a + b, 0) / 
             Object.values(evaluation.scores).length;
    }
    
    // Calculate overall score (average of both sports if available)
    const scores: number[] = [];
    
    if (student.evaluations.football) {
      scores.push(
        Object.values(student.evaluations.football.scores)
          .reduce((a, b) => a + b, 0) / 
          Object.values(student.evaluations.football.scores).length
      );
    }
    
    if (student.evaluations.athletics) {
      scores.push(
        Object.values(student.evaluations.athletics.scores)
          .reduce((a, b) => a + b, 0) / 
          Object.values(student.evaluations.athletics.scores).length
      );
    }
    
    return scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0;
  },

  getRankedStudents: (students: Student[], options: RankingOptions = {}): Student[] => {
    let rankedStudents = [...students];

    // Apply filters
    if (options.schoolFilter) {
      rankedStudents = rankedStudents.filter(s => s.schoolName === options.schoolFilter);
    }

    if (options.ageMin || options.ageMax) {
      rankedStudents = rankedStudents.filter(student => {
        const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
        return (!options.ageMin || age >= options.ageMin) && 
               (!options.ageMax || age <= options.ageMax);
      });
    }

    // Sort by score
    rankedStudents.sort((a, b) => {
      const scoreA = rankings.calculateStudentScore(a, options.sport);
      const scoreB = rankings.calculateStudentScore(b, options.sport);
      return scoreB - scoreA;
    });

    // Assign ranks
    return rankedStudents.map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  },

  getTopPerformers: (students: Student[], limit: number = 10): Student[] => {
    return rankings.getRankedStudents(students).slice(0, limit);
  },

  getSchoolRankings: (students: Student[]): Array<{ school: string; averageScore: number; studentCount: number }> => {
    const schoolScores: Record<string, { total: number; count: number }> = {};
    
    students.forEach(student => {
      const score = rankings.calculateStudentScore(student);
      if (!schoolScores[student.schoolName]) {
        schoolScores[student.schoolName] = { total: 0, count: 0 };
      }
      schoolScores[student.schoolName].total += score;
      schoolScores[student.schoolName].count += 1;
    });

    return Object.entries(schoolScores)
      .map(([school, data]) => ({
        school,
        averageScore: data.total / data.count,
        studentCount: data.count
      }))
      .sort((a, b) => b.averageScore - a.averageScore);
  }
}; 