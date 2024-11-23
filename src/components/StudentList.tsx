import { useState, useMemo } from 'react';
import { Student } from '../types';
import { UserPlus, Trash2, Edit, ChevronRight, Users, Check, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { ConfirmDialog } from './ConfirmDialog';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelect: (student: Student) => void;
}

type SortField = 'name' | 'school' | 'status';
type SortOrder = 'asc' | 'desc';

export function StudentList({ students, onEdit, onDelete, onAdd, onSelect }: StudentListProps) {
  const { showNotification } = useNotification();
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'selected' | 'eliminated'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter(student => {
        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'school') {
          comparison = a.schoolName.localeCompare(b.schoolName);
        } else if (sortField === 'status') {
          comparison = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [students, statusFilter, sortField, sortOrder, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Students</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus size={20} />
          Add Student
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="selected">Selected</option>
          <option value="eliminated">Eliminated</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredAndSortedStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{student.name}</h3>
              <p className="text-gray-600">{student.schoolName}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                student.status === 'selected' ? 'bg-green-100 text-green-800' :
                student.status === 'eliminated' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {student.status === 'selected' && <Check className="w-3 h-3 mr-1" />}
                {student.status === 'eliminated' && <X className="w-3 h-3 mr-1" />}
                {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(student)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                title="Edit student"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => setStudentToDelete(student)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                title="Delete student"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => onSelect(student)}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
                title="View details"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredAndSortedStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your criteria.
          </div>
        )}
      </div>
      
      <ConfirmDialog
        isOpen={!!studentToDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
        onConfirm={() => {
          if (studentToDelete) {
            onDelete(studentToDelete.id);
            showNotification('Student deleted successfully', 'success');
            setStudentToDelete(null);
          }
        }}
        onCancel={() => setStudentToDelete(null)}
        type="danger"
      />
    </div>
  );
}