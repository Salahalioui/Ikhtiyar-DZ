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
      ['Name', 'Date of Birth', 'School Name', 'Sport'],
      ['محمد أمين', '2010-01-15', 'ابتدائية الآمال', 'football'],
      ['عبد القادر', '2011-03-22', 'ابتدائية النجاح', 'athletics'],
      ['Mohammed Amine', '2012-05-10', 'ابتدائية بوعشرية امحمد', 'football'],
      ['Abdelkader', '2013-08-15', 'ابتدائية خداوي محمد', 'athletics']
    ];

    const BOM = '\uFEFF';
    const csv = BOM + Papa.unparse(template, {
      delimiter: ',',
      quotes: true,
      header: false
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const processFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          if (results.data.length === 0) {
            showNotification('No data found in file', 'error');
            return;
          }

          const students: Student[] = results.data.map((row: any, index) => {
            const name = row['Name'] || row['name'] || '';
            const dob = row['Date of Birth'] || row['date of birth'] || row['DOB'] || '';
            const school = row['School Name'] || row['school'] || row['School'] || '';
            const sport = (row['Sport'] || row['sport'] || '').toLowerCase();

            const rowErrors: string[] = [];
            if (!name) rowErrors.push(`Row ${index + 2}: Name is required`);
            if (!dob.match(/^\d{4}-\d{2}-\d{2}$/)) 
              rowErrors.push(`Row ${index + 2}: Date format should be YYYY-MM-DD`);
            if (!school) rowErrors.push(`Row ${index + 2}: School name is required`);
            if (!['football', 'athletics'].includes(sport))
              rowErrors.push(`Row ${index + 2}: Sport must be either 'football' or 'athletics'`);

            if (rowErrors.length > 0) {
              throw new Error(rowErrors.join('\n'));
            }

            if (school && !defaultSchools.includes(school)) {
              addCustomSchool(school);
            }

            return {
              id: crypto.randomUUID(),
              name,
              dateOfBirth: dob,
              schoolName: school,
              selectedSport: sport as 'football' | 'athletics',
              status: 'pending',
              evaluations: {},
              evaluationHistory: { football: [], athletics: [] }
            };
          });

          onImport(students);
          showNotification(
            `Successfully imported ${students.length} students`, 
            'success'
          );
          onClose();
        } catch (error) {
          showNotification(
            error instanceof Error ? error.message : 'Error processing file',
            'error'
          );
        }
      },
      error: (error) => {
        showNotification(`Error reading file: ${error.message}`, 'error');
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900">استيراد الطلاب / Import Students</h2>
              <p className="text-sm text-gray-500">قم بتحميل القالب أو اسحب ملف CSV / Download template or drag & drop CSV file</p>
            </div>
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

            {/* Instructions in both languages */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">التعليمات / Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>قم بتحميل ملف القالب CSV / Download the template CSV file</li>
                <li>املأ معلومات الطلاب / Fill in student information</li>
                <li>تأكد من اتباع تنسيق التاريخ: YYYY-MM-DD / Follow date format: YYYY-MM-DD</li>
                <li>يجب أن تكون الرياضة إما football أو athletics / Sport must be either 'football' or 'athletics'</li>
                <li>قم بتحميل ملف CSV المكتمل / Upload the completed CSV file</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 