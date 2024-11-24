import { useState } from 'react';
import { Student } from '../types';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import Papa from 'papaparse';
import { defaultSchools, addCustomSchool } from '../lib/schoolsList';

interface ImportStudentsProps {
  onImport: (students: Student[]) => void;
  onClose: () => void;
}

export function ImportStudents({ onImport, onClose }: ImportStudentsProps) {
  const { showNotification } = useNotification();
  const [dragActive, setDragActive] = useState(false);

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Date of Birth (YYYY-MM-DD)', 'School Name (or enter new)', 'Sport (football/athletics)'],
      ['محمد أمين', '2010-01-15', 'ابتدائية الآمال', 'football'],
      ['عبد القادر', '2011-03-22', 'ابتدائية النجاح', 'athletics']
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const students: Student[] = results.data.map((row: any) => {
            if (row['School Name'] && !defaultSchools.includes(row['School Name'])) {
              addCustomSchool(row['School Name']);
            }

            return {
              id: crypto.randomUUID(),
              name: row['Name']?.trim(),
              dateOfBirth: row['Date of Birth (YYYY-MM-DD)']?.trim(),
              schoolName: row['School Name']?.trim(),
              selectedSport: row['Sport (football/athletics)']?.trim().toLowerCase(),
              status: 'pending',
              evaluations: {},
              evaluationHistory: { football: [], athletics: [] }
            };
          });

          // Validate data
          const errors = students.reduce((acc: string[], student, index) => {
            if (!student.name) acc.push(`Row ${index + 2}: Name is required`);
            if (!student.dateOfBirth?.match(/^\d{4}-\d{2}-\d{2}$/)) 
              acc.push(`Row ${index + 2}: Invalid date format`);
            if (!student.schoolName) acc.push(`Row ${index + 2}: School name is required`);
            if (!['football', 'athletics'].includes(student.selectedSport))
              acc.push(`Row ${index + 2}: Sport must be either 'football' or 'athletics'`);
            return acc;
          }, []);

          if (errors.length > 0) {
            showNotification(`Validation errors found:\n${errors.join('\n')}`, 'error');
            return;
          }

          onImport(students);
          showNotification(`Successfully imported ${students.length} students`, 'success');
          onClose();
        } catch (error) {
          showNotification('Error processing file', 'error');
        }
      },
      error: () => {
        showNotification('Error reading file', 'error');
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Import Students</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
          </div>

          <div className="space-y-4">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900">Download Template</h3>
                <p className="text-sm text-blue-700">Use our CSV template for bulk import</p>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Template
              </button>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop your CSV file here, or
                <label className="mx-1 text-blue-600 hover:text-blue-700 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleChange}
                  />
                </label>
              </p>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Download the template CSV file</li>
                <li>Fill in the student information</li>
                <li>Make sure to follow the date format: YYYY-MM-DD</li>
                <li>Sport must be either 'football' or 'athletics'</li>
                <li>Upload the completed CSV file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 