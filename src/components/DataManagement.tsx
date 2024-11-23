import { useState, useRef } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { dataOperations } from '../lib/dataOperations';

interface DataManagementProps {
  onDataImported: () => void;
}

export function DataManagement({ onDataImported }: DataManagementProps) {
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = dataOperations.importData(text);
      
      setImportMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });

      if (result.success) {
        onDataImported();
      }
    } catch (error) {
      setImportMessage({
        type: 'error',
        text: 'Failed to read file'
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={dataOperations.downloadBackup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export Backup
          </button>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Import Backup
            </label>
          </div>
        </div>

        {importMessage && (
          <div className={`flex items-center gap-2 p-4 rounded-md ${
            importMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle className="h-5 w-5" />
            <p>{importMessage.text}</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <h3 className="font-medium mb-2">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Export creates a backup file of all your data</li>
            <li>Import allows you to restore data from a backup file</li>
            <li>Only import files that were exported from this application</li>
            <li>Importing will replace all existing data</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 