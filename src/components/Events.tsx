interface SportEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'trial' | 'competition' | 'training';
  participants: string[]; // student IDs
} 