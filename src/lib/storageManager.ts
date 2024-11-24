import { db } from './indexedDB';

export const storageManager = {
  async init() {
    await db.init();
    await this.migrateFromLocalStorage();
  },

  async migrateFromLocalStorage() {
    // Migrate existing data from localStorage to IndexedDB
    const studentsData = localStorage.getItem('talent-scout-data');
    if (studentsData) {
      const students = JSON.parse(studentsData);
      await Promise.all(
        students.map((student: any) => 
          db.put('students', student)
        )
      );
      localStorage.removeItem('talent-scout-data');
    }
  },

  async getStorageAnalytics() {
    const indexedDBUsage = await db.getStorageUsage();
    const localStorageUsage = Object.keys(localStorage).reduce((acc, key) => {
      acc[key] = new Blob([localStorage.getItem(key) || '']).size;
      return acc;
    }, {} as { [key: string]: number });

    return {
      indexedDB: indexedDBUsage,
      localStorage: localStorageUsage,
      total: Object.values(indexedDBUsage).reduce((a, b) => a + b, 0) +
             Object.values(localStorageUsage).reduce((a, b) => a + b, 0)
    };
  },

  async clearCache() {
    if ('caches' in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map(key => caches.delete(key))
      );
    }
  }
}; 