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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 print:p-0 print:bg-white print:items-start">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 print:shadow-none print:max-h-none"
      >
        {/* Header - Only show on screen */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Student Licenses</h2>
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
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Licenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-8 print:p-4">
          {students.map(student => (
            <StudentLicense key={student.id} student={student} />
          ))}
        </div>
      </motion.div>
    </div>
  );
} 