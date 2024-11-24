export const backupService = {
  exportData: () => {
    const data = {
      students: localStorage.getItem('talent-scout-data'),
      schools: localStorage.getItem('custom-schools'),
      config: localStorage.getItem('talent-scout-config'),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ikhtiyar-backup-${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  importData: async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.students || !data.config) {
        return { success: false, message: 'Invalid backup file structure' };
      }

      localStorage.setItem('talent-scout-data', data.students);
      localStorage.setItem('talent-scout-config', data.config);
      if (data.schools) {
        localStorage.setItem('custom-schools', data.schools);
      }

      return { success: true, message: 'Data restored successfully' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { success: false, message: `Failed to restore backup: ${errorMessage}` };
    }
  }
}; 