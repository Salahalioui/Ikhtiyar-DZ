import { useState } from 'react';
import { EvaluationMetric, SportConfig } from '../types';
import { config } from '../lib/config';
import { 
  Plus, Trash2, Save, RotateCcw, 
  Dumbbell, Timer, 
  Edit2, Check, X, AlertCircle, ChevronDown 
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricsConfigProps {
  onClose: () => void;
}

const DEFAULT_METRIC: EvaluationMetric = {
  id: '',
  name: '',
  description: '',
  min: 1,
  max: 10
};

export function MetricsConfig({ onClose }: MetricsConfigProps) {
  const [selectedSport, setSelectedSport] = useState<string>('football');
  const [sports, setSports] = useState<SportConfig[]>(config.getSports());
  const [isAddingSport, setIsAddingSport] = useState(false);
  const [newSport, setNewSport] = useState<Partial<SportConfig>>({
    id: '',
    name: '',
    icon: 'Activity',
    metrics: []
  });
  const { showNotification } = useNotification();

  const handleAddMetric = (sportId: string) => {
    setSports(sports.map(sport => {
      if (sport.id === sportId) {
        return {
          ...sport,
          metrics: [...sport.metrics, {
            ...DEFAULT_METRIC,
            id: `metric_${Date.now()}`
          }]
        };
      }
      return sport;
    }));
  };

  const handleUpdateMetric = (
    sportId: string,
    metricIndex: number,
    field: keyof EvaluationMetric,
    value: string | number
  ) => {
    setSports(sports.map(sport => {
      if (sport.id === sportId) {
        const updatedMetrics = [...sport.metrics];
        if (field === 'id') {
          updatedMetrics[metricIndex][field] = value.toString().toLowerCase().replace(/\s+/g, '_');
        } else if (field === 'min' || field === 'max') {
          updatedMetrics[metricIndex][field] = Number(value);
        } else {
          updatedMetrics[metricIndex][field] = value.toString();
        }
        return { ...sport, metrics: updatedMetrics };
      }
      return sport;
    }));
  };

  const handleDeleteMetric = (sportId: string, metricIndex: number) => {
    setSports(sports.map(sport => {
      if (sport.id === sportId) {
        const metrics = [...sport.metrics];
        metrics.splice(metricIndex, 1);
        return { ...sport, metrics };
      }
      return sport;
    }));
  };

  const handleAddSport = () => {
    if (!newSport.name?.trim()) {
      showNotification('Sport name is required', 'error');
      return;
    }

    const sportId = newSport.name.toLowerCase().replace(/\s+/g, '_');
    const newSportConfig: SportConfig = {
      id: sportId,
      name: newSport.name,
      icon: newSport.icon || 'Activity',
      metrics: [],
      isCustom: true
    };

    setSports([...sports, newSportConfig]);
    setSelectedSport(sportId);
    setIsAddingSport(false);
    setNewSport({ id: '', name: '', icon: 'Activity', metrics: [] });
    showNotification(`Sport "${newSport.name}" added successfully`, 'success');
  };

  const handleDeleteSport = (sportId: string) => {
    if (!window.confirm('Are you sure you want to delete this sport and all its metrics?')) {
      return;
    }

    setSports(sports.filter(s => s.id !== sportId));
    setSelectedSport('football');
    showNotification('Sport deleted successfully', 'info');
  };

  const handleSave = () => {
    // Validate metrics
    let isValid = true;
    let errorMessage = '';

    sports.forEach(sport => {
      if (sport.metrics.length === 0) {
        isValid = false;
        errorMessage = `${sport.name} must have at least one metric`;
        return;
      }

      sport.metrics.forEach(metric => {
        if (!metric.name || !metric.description) {
          isValid = false;
          errorMessage = 'All metrics must have a name and description';
          return;
        }
        if (metric.min >= metric.max) {
          isValid = false;
          errorMessage = 'Minimum value must be less than maximum value';
          return;
        }
      });
    });

    if (!isValid) {
      showNotification(errorMessage, 'error');
      return;
    }

    config.saveSports(sports);
    showNotification('Configuration saved successfully', 'success');
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default configuration?')) {
      config.resetToDefault();
      setSports(config.getSports());
      setSelectedSport('football');
      showNotification('Configuration reset to default', 'info');
    }
  };

  const currentSport = sports.find(s => s.id === selectedSport);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Configure Sports & Metrics</h2>
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Sports Selection */}
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
            {sports.map(sport => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  selectedSport === sport.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {sport.id === 'football' && <Dumbbell className="h-5 w-5" />}
                {sport.id === 'athletics' && <Timer className="h-5 w-5" />}
                {sport.name}
                {sport.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSport(sport.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-600 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </button>
            ))}
            <button
              onClick={() => setIsAddingSport(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Plus className="h-5 w-5" />
              Add Sport
            </button>
          </div>

          {/* Add New Sport Form */}
          <AnimatePresence>
            {isAddingSport && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-blue-50 rounded-lg p-4"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sport Name
                    </label>
                    <input
                      type="text"
                      value={newSport.name}
                      onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Basketball"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddingSport(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSport}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Sport
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metrics Configuration */}
          {currentSport && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentSport.name} Metrics
                </h3>
                <button
                  onClick={() => handleAddMetric(currentSport.id)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <Plus className="h-4 w-4" />
                  Add Metric
                </button>
              </div>

              <div className="space-y-4">
                {currentSport.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metric Name
                      </label>
                      <input
                        type="text"
                        value={metric.name}
                        onChange={(e) => handleUpdateMetric(currentSport.id, index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Speed"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={metric.description}
                        onChange={(e) => handleUpdateMetric(currentSport.id, index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Player's acceleration and sprint speed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Score
                      </label>
                      <input
                        type="number"
                        value={metric.min}
                        onChange={(e) => handleUpdateMetric(currentSport.id, index, 'min', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Score
                        </label>
                        <input
                          type="number"
                          value={metric.max}
                          onChange={(e) => handleUpdateMetric(currentSport.id, index, 'max', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteMetric(currentSport.id, index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
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
      </motion.div>
    </div>
  );
} 