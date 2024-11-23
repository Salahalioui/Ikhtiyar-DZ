export interface Student {
  id: string;
  name: string;
  dateOfBirth: string;
  schoolName: string;
  status: 'pending' | 'selected' | 'eliminated';
  rank?: number;
  evaluations: {
    football?: SportEvaluation;
    athletics?: SportEvaluation;
  };
  evaluationHistory: {
    football: EvaluationHistory[];
    athletics: EvaluationHistory[];
  };
}

export interface SportEvaluation {
  date: string;
  scores: {
    [key: string]: number;
  };
  comments: string;
}

export interface EvaluationMetric {
  id: string;
  name: string;
  description: string;
  min: number;
  max: number;
}

export interface EvaluationHistory {
  date: string;
  evaluation: SportEvaluation;
}