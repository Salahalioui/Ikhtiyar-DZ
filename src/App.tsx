import { useState, useEffect } from 'react';
import { Student } from './types';
import { storage } from './lib/storage';
import { StudentList } from './components/StudentList';
import { StudentForm } from './components/StudentForm';
import { StudentDetails } from './components/StudentDetails';
import { Reports } from './components/Reports';
import { Notifications } from './components/Notifications';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ClipboardList, Settings } from 'lucide-react';
import { MetricsConfig } from './components/MetricsConfig';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);

  useEffect(() => {
    setStudents(storage.getStudents());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      storage.updateStudent(student);
    } else {
      storage.addStudent(student);
    }
    setStudents(storage.getStudents());
    setEditingStudent(null);
    setIsAddingStudent(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      storage.deleteStudent(id);
      setStudents(storage.getStudents());
    }
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    storage.updateStudent(updatedStudent);
    setStudents(storage.getStudents());
    setSelectedStudent(updatedStudent);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Talent Scout</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMetricsConfig(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  <Settings className="h-5 w-5" />
                  Configure Metrics
                </button>
                <button
                  onClick={() => setShowReports(!showReports)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  {showReports ? 'Back to Students' : 'View Reports'}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showReports ? (
            <Reports students={students} />
          ) : selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              onSave={handleUpdateStudent}
              onBack={() => setSelectedStudent(null)}
            />
          ) : (isAddingStudent || editingStudent) ? (
            <StudentForm
              student={editingStudent || undefined}
              onSave={handleSaveStudent}
              onCancel={() => {
                setEditingStudent(null);
                setIsAddingStudent(false);
              }}
            />
          ) : (
            <StudentList
              students={students}
              onEdit={setEditingStudent}
              onDelete={handleDeleteStudent}
              onAdd={() => setIsAddingStudent(true)}
              onSelect={setSelectedStudent}
            />
          )}
        </main>
        {showMetricsConfig && (
          <MetricsConfig onClose={() => setShowMetricsConfig(false)} />
        )}
        <Notifications />
      </div>
    </NotificationProvider>
  );
}

export default App;