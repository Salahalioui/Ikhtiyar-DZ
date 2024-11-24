import { Student } from '../types';
import { User } from 'lucide-react';
import { ageGroups } from '../lib/ageGroups';

interface StudentLicenseProps {
  student: Student;
}

export function StudentLicense({ student }: StudentLicenseProps) {
  const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
  const ageGroup = ageGroups.calculateAgeGroup(student.dateOfBirth);

  return (
    <div className="w-[85.6mm] h-[54mm] bg-white rounded-lg shadow-lg p-4 flex gap-4 border-2 border-blue-600 print:border print:shadow-none">
      {/* Left side - Photo */}
      <div className="w-[20mm] h-[30mm] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
        <User className="w-8 h-8 text-gray-400" />
      </div>

      {/* Right side - Info */}
      <div className="flex-1 text-sm">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-blue-600">Ikhtiyar DZ</h3>
          <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {student.selectedSport.toUpperCase()}
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-semibold">{student.name}</p>
          <p className="text-gray-600 text-xs">{student.schoolName}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Age:</span>
              <span className="ml-1 font-medium">{age} years</span>
            </div>
            <div>
              <span className="text-gray-500">Group:</span>
              <span className="ml-1 font-medium">{ageGroup}</span>
            </div>
            <div>
              <span className="text-gray-500">DOB:</span>
              <span className="ml-1 font-medium">
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="ml-1 font-medium capitalize">{student.status}</span>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">ID: {student.id.slice(0, 8)}</div>
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 