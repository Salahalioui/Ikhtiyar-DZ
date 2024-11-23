export const batchOperations = {
  updateStatus: (studentIds: string[], newStatus: Student['status']) => {
    const students = storage.getStudents();
    const updated = students.map(student => 
      studentIds.includes(student.id) 
        ? { ...student, status: newStatus }
        : student
    );
    storage.saveStudents(updated);
  },

  deleteMultiple: (studentIds: string[]) => {
    const students = storage.getStudents();
    const remaining = students.filter(student => !studentIds.includes(student.id));
    storage.saveStudents(remaining);
  }
}; 