interface Feedback {
  studentId: string;
  coachId: string;
  date: string;
  type: 'performance' | 'behavior' | 'progress';
  content: string;
  recommendations: string[];
} 