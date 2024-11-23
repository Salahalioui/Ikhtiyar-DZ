import React, { useState, useEffect } from 'react';
import { Student } from './types';
import { storage } from './lib/storage';
import { StudentList } from './components/StudentList';
import { StudentForm } from './components/StudentForm';
import { StudentDetails } from './components/StudentDetails';
import { ClipboardList } from 'lucide-react';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setStudents(storage.getStudents());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Talent Scout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedStudent ? (
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
    </div>
  );
}

export default App;