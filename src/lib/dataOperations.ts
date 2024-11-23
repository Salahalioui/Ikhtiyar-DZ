import { Student } from '../types';
import { storage } from './storage';

interface ExportData {
  version: string;
  timestamp: string;
  students: Student[];
}

export const dataOperations = {
  exportData: (): string => {
    const exportData: ExportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      students: storage.getStudents()
    };
    
    return JSON.stringify(exportData, null, 2);
  },

  importData: (jsonString: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonString) as ExportData;
      
      // Validate data structure
      if (!data.version || !data.timestamp || !Array.isArray(data.students)) {
        throw new Error('Invalid data format');
      }

      // Validate each student object
      data.students.forEach(student => {
        if (!student.id || !student.name || !student.dateOfBirth || !student.schoolName) {
          throw new Error('Invalid student data');
        }
      });

      // Save the imported data
      storage.saveStudents(data.students);
      
      return {
        success: true,
        message: `Successfully imported ${data.students.length} students`
      };
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  downloadBackup: () => {
    const data = dataOperations.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `talent-scout-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}; 