import { Student } from '../types';

const STORAGE_KEY = 'talent-scout-data';

export const storage = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  },

  addStudent: (student: Student) => {
    const students = storage.getStudents();
    const newStudent = {
      ...student,
      status: student.status || 'pending'
    };
    students.push(newStudent);
    storage.saveStudents(students);
  },

  updateStudent: (updatedStudent: Student) => {
    const students = storage.getStudents();
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index !== -1) {
      students[index] = updatedStudent;
      storage.saveStudents(students);
    }
  },

  deleteStudent: (id: string) => {
    const students = storage.getStudents();
    storage.saveStudents(students.filter(s => s.id !== id));
  }
};