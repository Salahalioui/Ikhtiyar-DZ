interface SearchFilters {
  ageRange: [number, number];
  performance: {
    metric: string;
    min: number;
    max: number;
  }[];
  location: string[];
  dateRange: [Date, Date];
} 