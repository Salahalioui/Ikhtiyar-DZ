import { useState, useMemo, useEffect, useRef } from 'react';
import { Student } from '../types';
import { UserPlus, Trash2, Edit, ChevronRight, Users, Check, X, Search, Filter, UserCheck, UserX } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { ConfirmDialog } from './ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { batchOperations } from '../lib/batchOperations';
import { paginateData, PaginationOptions } from '../lib/pagination';
import { useLazyLoad } from '../hooks/useLazyLoad';

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
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>({
    page: 1,
    pageSize: 20,
    sortField: 'name',
    sortOrder: 'asc'
  });

  const {
    displayedItems: paginatedStudents,
    hasMore,
    isLoading,
    loadMore
  } = useLazyLoad({
    items: filteredAndSortedStudents,
    initialBatchSize: paginationOptions.pageSize
  });

  // Add intersection observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredAndSortedStudents.length) {
      setSelectedStudents(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedStudents(new Set(filteredAndSortedStudents.map(s => s.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkStatusUpdate = (newStatus: 'selected' | 'eliminated' | 'pending') => {
    if (selectedStudents.size === 0) return;

    const studentIds = Array.from(selectedStudents);
    
    // Get confirmation message based on status change
    const confirmMessage = `Are you sure you want to mark ${studentIds.length} students as ${newStatus}? This will override any previous status.`;
    
    if (window.confirm(confirmMessage)) {
      batchOperations.updateStatus(studentIds, newStatus);
      showNotification(`Updated status for ${studentIds.length} students to ${newStatus}`, 'success');
      setSelectedStudents(new Set());
      setShowBulkActions(false);
      // Refresh the student list
      window.location.reload();
    }
  };

  const handleBulkDelete = () => {
    if (selectedStudents.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedStudents.size} students?`)) {
      const studentIds = Array.from(selectedStudents);
      batchOperations.deleteMultiple(studentIds);
      showNotification(`Deleted ${studentIds.length} students`, 'success');
      setSelectedStudents(new Set());
      setShowBulkActions(false);
      // Refresh the student list
      window.location.reload();
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

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-blue-50 border border-blue-100 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-700">
                  {selectedStudents.size} students selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate('selected')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <UserCheck className="h-4 w-4" />
                  Mark Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('eliminated')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <UserX className="h-4 w-4" />
                  Mark Eliminated
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('pending')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <Users className="h-4 w-4" />
                  Mark Pending
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Cards */}
      <div className="grid gap-4">
        {/* Select All Checkbox */}
        <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            checked={selectedStudents.size === filteredAndSortedStudents.length}
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">Select All</span>
        </div>

        <AnimatePresence mode="popLayout">
          {paginatedStudents.map((student) => (
            <motion.div
              key={student.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                selectedStudents.has(student.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
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

        {/* Loading indicator and observer target */}
        <div ref={observerTarget} className="h-10 flex items-center justify-center">
          {isLoading && <LoadingSpinner size="small" />}
        </div>
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