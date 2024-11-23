import React from 'react';
import { Student } from '../types';
import { UserPlus, Trash2, Edit, ChevronRight } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelect: (student: Student) => void;
}

export function StudentList({ students, onEdit, onDelete, onAdd, onSelect }: StudentListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Students</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Add Student
        </button>
      </div>
      
      <div className="grid gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{student.name}</h3>
              <p className="text-gray-600">{student.schoolName}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(student)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="Edit student"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onDelete(student.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                title="Delete student"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => onSelect(student)}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                title="View details"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {students.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students added yet. Click the "Add Student" button to get started.
          </div>
        )}
      </div>
    </div>
  );
}