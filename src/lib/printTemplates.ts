import { Student } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add type for jsPDF with autoTable
interface JsPDFWithAutoTable extends jsPDF {
  autoTable: (options: {
    head: string[][];
    body: string[][];
    startY: number;
  }) => void;
}

export const printTemplates = {
  studentCard: (student: Student) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [54, 85.6]
    });

    // Add content to PDF
    doc.setFontSize(8);
    doc.text('Ikhtiyar DZ', 5, 5);
    doc.text(student.name, 5, 10);
    // ... add more content

    return doc;
  },
  
  schoolReport: (schoolName: string, students: Student[]) => {
    const doc = new jsPDF() as JsPDFWithAutoTable;
    const schoolStudents = students.filter(s => s.schoolName === schoolName);

    doc.setFontSize(16);
    doc.text(`School Report: ${schoolName}`, 20, 20);
    
    // Add table with student data
    const tableData = schoolStudents.map(student => [
      student.name,
      student.dateOfBirth,
      student.selectedSport,
      student.status
    ]);

    doc.autoTable({
      head: [['Name', 'Date of Birth', 'Sport', 'Status']],
      body: tableData,
      startY: 30
    });

    return doc;
  },
  
  evaluationSheet: (student: Student) => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Student Evaluation Sheet', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 30);
    doc.text(`School: ${student.schoolName}`, 20, 40);
    
    // Add evaluation metrics
    if (student.evaluations.football) {
      doc.text('Football Evaluation:', 20, 50);
      Object.entries(student.evaluations.football.scores).forEach(([metric, score], index) => {
        doc.text(`${metric}: ${score}`, 30, 60 + (index * 10));
      });
    }

    if (student.evaluations.athletics) {
      doc.text('Athletics Evaluation:', 20, 120);
      Object.entries(student.evaluations.athletics.scores).forEach(([metric, score], index) => {
        doc.text(`${metric}: ${score}`, 30, 130 + (index * 10));
      });
    }

    return doc;
  }
}; 