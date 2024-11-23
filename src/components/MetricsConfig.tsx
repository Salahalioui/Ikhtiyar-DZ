import { useState } from 'react';
import { EvaluationMetric } from '../types';
import { config } from '../lib/config';
import { Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface MetricsConfigProps {
  onClose: () => void;
}

export function MetricsConfig({ onClose }: MetricsConfigProps) {
  const [selectedSport, setSelectedSport] = useState<'football' | 'athletics'>('football');
  const [metrics, setMetrics] = useState<EvaluationMetric[]>(config.getMetrics(selectedSport));
  const { showNotification } = useNotification();

  const handleAddMetric = () => {
    const newMetric: EvaluationMetric = {
      id: `metric_${Date.now()}`,
      name: '',
      description: '',
      min: 1,
      max: 10
    };
    setMetrics([...metrics, newMetric]);
  };

  const handleUpdateMetric = (index: number, field: keyof EvaluationMetric, value: string | number) => {
    const updatedMetrics = [...metrics];
    if (field === 'id') {
      updatedMetrics[index][field] = value.toString().toLowerCase().replace(/\s+/g, '_');
    } else if (field === 'min' || field === 'max') {
      updatedMetrics[index][field] = Number(value);
    } else {
      updatedMetrics[index][field] = value.toString();
    }
    setMetrics(updatedMetrics);
  };

  const handleDeleteMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validate metrics
    const isValid = metrics.every(metric => 
      metric.id && 
      metric.name && 
      metric.description && 
      metric.min < metric.max
    );

    if (!isValid) {
      showNotification('Please fill all fields and ensure min is less than max', 'error');
      return;
    }

    config.saveMetrics(selectedSport, metrics);
    showNotification('Metrics configuration saved successfully', 'success');
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default metrics?')) {
      config.resetToDefault();
      setMetrics(config.getMetrics(selectedSport));
      showNotification('Metrics reset to default', 'info');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Configure Evaluation Metrics</h2>
            <div className="flex gap-4">
              <select
                value={selectedSport}
                onChange={(e) => {
                  setSelectedSport(e.target.value as 'football' | 'athletics');
                  setMetrics(config.getMetrics(e.target.value as 'football' | 'athletics'));
                }}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="football">Football</option>
                <option value="athletics">Athletics</option>
              </select>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metric Name</label>
                  <input
                    type="text"
                    value={metric.name}
                    onChange={(e) => handleUpdateMetric(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Speed"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={metric.description}
                    onChange={(e) => handleUpdateMetric(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Player's acceleration and sprint speed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
                  <input
                    type="number"
                    value={metric.min}
                    onChange={(e) => handleUpdateMetric(index, 'min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                    <input
                      type="number"
                      value={metric.max}
                      onChange={(e) => handleUpdateMetric(index, 'max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteMetric(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleAddMetric}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Plus className="h-4 w-4" />
              Add Metric
            </button>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 