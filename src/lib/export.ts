import { Student } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToCSV(students: Student[], filename: string) {
  const config = storage.getConfig(); // Get current metric configuration
  
  // Create dynamic headers based on configured metrics
  const headers = [
    'Name',
    'School',
    'Date of Birth',
    'Status',
    ...config.football.map(m => `Football - ${m.name}`),
    'Football Comments',
    ...config.athletics.map(m => `Athletics - ${m.name}`),
    'Athletics Comments'
  ];

  // Transform students data dynamically based on config
  const rows = students.map(student => {
    const football = student.evaluations.football;
    const athletics = student.evaluations.athletics;

    return [
      student.name,
      student.schoolName,
      student.dateOfBirth,
      student.status,
      ...config.football.map(m => football?.scores[m.id] || ''),
      football?.comments || '',
      ...config.athletics.map(m => athletics?.scores[m.id] || ''),
      athletics?.comments || ''
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportToPDF(students: Student[], statistics: any) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Talent Scout Report', 15, 15);
  
  // Add statistics
  doc.setFontSize(12);
  doc.text(`Total Students: ${statistics.totalStudents}`, 15, 30);
  doc.text(`Football Evaluations: ${statistics.withFootball}`, 15, 37);
  doc.text(`Athletics Evaluations: ${statistics.withAthletics}`, 15, 44);

  // Add student table
  const tableData = students.map(student => [
    student.name,
    student.schoolName,
    student.dateOfBirth,
    student.evaluations.football 
      ? Object.values(student.evaluations.football.scores)
          .reduce((a, b) => a + b, 0) / 
          Object.values(student.evaluations.football.scores).length
      : 'N/A',
    student.evaluations.athletics
      ? Object.values(student.evaluations.athletics.scores)
          .reduce((a, b) => a + b, 0) /
          Object.values(student.evaluations.athletics.scores).length
      : 'N/A'
  ]);

  (doc as any).autoTable({
    startY: 55,
    head: [['Name', 'School', 'Date of Birth', 'Football Avg', 'Athletics Avg']],
    body: tableData,
  });

  doc.save('talent-scout-report.pdf');
} 