import { useState } from 'react';

export interface FeedbackData {
  studentId: string;
  coachId: string;
  date: string;
  type: 'performance' | 'behavior' | 'progress';
  content: string;
  recommendations: string[];
}

export function FeedbackForm({ onSubmit }: { onSubmit: (data: FeedbackData) => void }) {
  const [feedback, setFeedback] = useState<Omit<FeedbackData, 'date'>>({
    studentId: '',
    coachId: '',
    type: 'performance',
    content: '',
    recommendations: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...feedback,
      date: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form implementation */}
    </form>
  );
} 