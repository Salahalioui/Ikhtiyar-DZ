import { useState, useMemo } from 'react';
import { Download, FileText } from 'lucide-react';
import { Student } from '../types';
import { exportToCSV } from '../lib/export';
import { exportToPDF } from '../lib/export';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DataManagement } from './DataManagement';

interface ReportsProps {
  students: Student[];
}

interface ChartData {
  metric: string;
  Football?: number;
  Athletics?: number;
}

const STATUS_COLORS = {
  selected: '#22c55e',  // green-500
  eliminated: '#ef4444', // red-500
  pending: '#94a3b8'    // gray-400
};

export function Reports({ students }: ReportsProps) {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<'all' | 'football' | 'athletics'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'selected' | 'eliminated'>('all');
  const [minAge, setMinAge] = useState<string>('');
  const [maxAge, setMaxAge] = useState<string>('');

  const schools = useMemo(() => {
    const uniqueSchools = new Set(students.map(s => s.schoolName));
    return ['all', ...Array.from(uniqueSchools)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSchool = selectedSchool === 'all' || student.schoolName === selectedSchool;
      const matchesSport = selectedSport === 'all' || 
        (selectedSport === 'football' && student.evaluations.football) ||
        (selectedSport === 'athletics' && student.evaluations.athletics);
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
      
      const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
      const matchesAge = (!minAge || age >= parseInt(minAge)) && 
                        (!maxAge || age <= parseInt(maxAge));

      return matchesSchool && matchesSport && matchesStatus && matchesAge;
    });
  }, [students, selectedSchool, selectedSport, selectedStatus, minAge, maxAge]);

  const statistics = useMemo(() => {
    const stats = {
      totalStudents: filteredStudents.length,
      withFootball: filteredStudents.filter(s => s.evaluations.football).length,
      withAthletics: filteredStudents.filter(s => s.evaluations.athletics).length,
      statusCounts: {
        selected: filteredStudents.filter(s => s.status === 'selected').length,
        eliminated: filteredStudents.filter(s => s.status === 'eliminated').length,
        pending: filteredStudents.filter(s => s.status === 'pending').length
      },
      averageScores: {
        football: {} as Record<string, number>,
        athletics: {} as Record<string, number>
      }
    };

    // Calculate average scores for each metric
    filteredStudents.forEach(student => {
      if (student.evaluations.football) {
        Object.entries(student.evaluations.football.scores).forEach(([metric, score]) => {
          if (!stats.averageScores.football[metric]) {
            stats.averageScores.football[metric] = 0;
          }
          stats.averageScores.football[metric] += score;
        });
      }
      if (student.evaluations.athletics) {
        Object.entries(student.evaluations.athletics.scores).forEach(([metric, score]) => {
          if (!stats.averageScores.athletics[metric]) {
            stats.averageScores.athletics[metric] = 0;
          }
          stats.averageScores.athletics[metric] += score;
        });
      }
    });

    // Calculate averages
    Object.keys(stats.averageScores.football).forEach(metric => {
      stats.averageScores.football[metric] /= stats.withFootball || 1;
    });
    Object.keys(stats.averageScores.athletics).forEach(metric => {
      stats.averageScores.athletics[metric] /= stats.withAthletics || 1;
    });

    return stats;
  }, [filteredStudents]);

  const chartData = useMemo(() => {
    const data: ChartData[] = [];
    if (selectedSport === 'all' || selectedSport === 'football') {
      Object.entries(statistics.averageScores.football).forEach(([metric, score]) => {
        data.push({
          metric,
          Football: Number(score.toFixed(2))
        });
      });
    }
    if (selectedSport === 'all' || selectedSport === 'athletics') {
      Object.entries(statistics.averageScores.athletics).forEach(([metric, score]) => {
        const existingEntry = data.find(d => d.metric === metric);
        if (existingEntry) {
          existingEntry.Athletics = Number(score.toFixed(2));
        } else {
          data.push({
            metric,
            Athletics: Number(score.toFixed(2))
          });
        }
      });
    }
    return data;
  }, [statistics, selectedSport]);

  const statusData = useMemo(() => {
    return [
      { name: 'Selected', value: statistics.statusCounts.selected },
      { name: 'Eliminated', value: statistics.statusCounts.eliminated },
      { name: 'Pending', value: statistics.statusCounts.pending }
    ];
  }, [statistics]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Performance Reports</h2>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Age"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Max Age"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {schools.map(school => (
              <option key={school} value={school}>
                {school === 'all' ? 'All Schools' : school}
              </option>
            ))}
          </select>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as 'all' | 'football' | 'athletics')}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="athletics">Athletics</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'pending' | 'selected' | 'eliminated')}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="selected">Selected</option>
            <option value="eliminated">Eliminated</option>
          </select>
          <button
            onClick={() => exportToCSV(filteredStudents, `talent-scout-report.csv`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => exportToPDF(filteredStudents, statistics)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-semibold">{statistics.totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Selected</h3>
          <p className="text-2xl font-semibold text-green-600">{statistics.statusCounts.selected}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Eliminated</h3>
          <p className="text-2xl font-semibold text-red-600">{statistics.statusCounts.eliminated}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-semibold text-gray-600">{statistics.statusCounts.pending}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(selectedSport === 'all' || selectedSport === 'football') && (
                  <Bar dataKey="Football" fill="#3b82f6" />
                )}
                {(selectedSport === 'all' || selectedSport === 'athletics') && (
                  <Bar dataKey="Athletics" fill="#10b981" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill={STATUS_COLORS.selected} />
                  <Cell fill={STATUS_COLORS.eliminated} />
                  <Cell fill={STATUS_COLORS.pending} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Student Performance</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Football Avg
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Athletics Avg
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.schoolName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === 'selected' ? 'bg-green-100 text-green-800' :
                      student.status === 'eliminated' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.evaluations.football 
                      ? (Object.values(student.evaluations.football.scores).reduce((a, b) => a + b, 0) / 
                        Object.values(student.evaluations.football.scores).length).toFixed(1)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.evaluations.athletics
                      ? (Object.values(student.evaluations.athletics.scores).reduce((a, b) => a + b, 0) /
                        Object.values(student.evaluations.athletics.scores).length).toFixed(1)
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DataManagement 
        onDataImported={() => {
          window.location.reload();
        }} 
      />
    </div>
  );
} 