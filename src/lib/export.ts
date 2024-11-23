import { Student } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToCSV(students: Student[], filename: string) {
  // Create CSV headers
  const headers = [
    'Name',
    'School',
    'Date of Birth',
    'Football - Speed',
    'Football - Ball Control',
    'Football - Passing',
    'Football - Shooting',
    'Football - Tactical',
    'Football Comments',
    'Athletics - Sprint',
    'Athletics - Endurance',
    'Athletics - Jumping',
    'Athletics - Throwing',
    'Athletics - Coordination',
    'Athletics Comments'
  ];

  // Transform students data into CSV rows
  const rows = students.map(student => {
    const football = student.evaluations.football;
    const athletics = student.evaluations.athletics;

    return [
      student.name,
      student.schoolName,
      student.dateOfBirth,
      football?.scores.speed || '',
      football?.scores.ballControl || '',
      football?.scores.passing || '',
      football?.scores.shooting || '',
      football?.scores.tactical || '',
      football?.comments || '',
      athletics?.scores.sprint || '',
      athletics?.scores.endurance || '',
      athletics?.scores.jumping || '',
      athletics?.scores.throwing || '',
      athletics?.scores.coordination || '',
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