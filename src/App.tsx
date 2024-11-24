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
import { ClipboardList, Settings, Menu, X, Info } from 'lucide-react';
import { MetricsConfig } from './components/MetricsConfig';
import { About } from './components/About';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showMetricsConfig, setShowMetricsConfig] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    setStudents(storage.getStudents());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Ikhtiyar DZ...</h2>
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <header className="bg-white shadow-md relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Ikhtiyar DZ</h1>
                  <p className="text-sm text-gray-500">Talent Scout System</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => setShowMetricsConfig(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  Configure Metrics
                </button>
                <button
                  onClick={() => setShowReports(!showReports)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showReports ? 'Back to Students' : 'View Reports'}
                </button>
                <button
                  onClick={() => setShowAbout(!showAbout)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Info className="h-5 w-5" />
                  About
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
                <button
                  onClick={() => {
                    setShowMetricsConfig(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full"
                >
                  <Settings className="h-5 w-5" />
                  Configure Metrics
                </button>
                <button
                  onClick={() => {
                    setShowReports(!showReports);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
                >
                  {showReports ? 'Back to Students' : 'View Reports'}
                </button>
                <button
                  onClick={() => {
                    setShowAbout(!showAbout);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full"
                >
                  <Info className="h-5 w-5" />
                  About
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {showAbout ? (
              <About />
            ) : showReports ? (
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
          </div>
        </main>

        {showMetricsConfig && (
          <MetricsConfig onClose={() => setShowMetricsConfig(false)} />
        )}
        <Notifications />

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Ikhtiyar DZ. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </NotificationProvider>
  );
}

export default App;