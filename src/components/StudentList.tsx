import { useState, useMemo } from 'react';
import { Student } from '../types';
import { UserPlus, Trash2, Edit, ChevronRight, Users, Check, X, Search, Filter } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { ConfirmDialog } from './ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showFilters, setShowFilters] = useState(false);

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
          comparison = (a.status || '').localeCompare(b.status || '');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Students</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredAndSortedStudents.length} student{filteredAndSortedStudents.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <UserPlus size={20} />
          Add Student
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students by name or school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300 text-gray-700'
            }`}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="selected">Selected</option>
                    <option value="eliminated">Eliminated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="school">School</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Student Cards */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedStudents.map((student) => (
            <motion.div
              key={student.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-gray-600 mt-1">{student.schoolName}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'selected' ? 'bg-green-100 text-green-800' :
                        student.status === 'eliminated' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status === 'selected' && <Check className="w-3 h-3 mr-1" />}
                        {student.status === 'eliminated' && <X className="w-3 h-3 mr-1" />}
                        {student.status?.charAt(0).toUpperCase() + student.status?.slice(1)}
                      </span>
                      {student.evaluations.football && (
                        <span className="text-xs text-gray-500">Football Evaluation ✓</span>
                      )}
                      {student.evaluations.athletics && (
                        <span className="text-xs text-gray-500">Athletics Evaluation ✓</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(student)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit student"
                    >
                      <Edit size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setStudentToDelete(student)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete student"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onSelect(student)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                      title="View details"
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredAndSortedStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <Users className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
              <button
                onClick={onAdd}
                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Add your first student
              </button>
            </div>
          </motion.div>
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