import { Student } from '../types';
import { StudentLicense } from './StudentLicense';
import { Printer, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrintLicensesProps {
  students: Student[];
  onClose: () => void;
}

export function PrintLicenses({ students, onClose }: PrintLicensesProps) {
  const handlePrint = () => {
    window.print();
  };

  // Calculate pages for preview
  const licensesPerPage = 4; // 2x2 grid
  const pages = Math.ceil(students.length / licensesPerPage);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        {/* Header - Only show on screen */}
        <div className="flex justify-between items-center mb-6 print-hidden">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Student Licenses</h2>
            <p className="text-sm text-gray-500">
              {students.length} licenses - {pages} pages
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              Print Licenses
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close print dialog"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Single Layout for both Preview and Print */}
        <div id="licenses-container" className="licenses-grid">
          {students.map((student, index) => (
            <div key={`page-${index}`} className="print-page">
              <StudentLicense student={student} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 