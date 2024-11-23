import { useState, useMemo } from 'react';
import { Download, FileText, Filter, ChevronDown, Printer } from 'lucide-react';
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { DataManagement } from './DataManagement';
import { ageGroups } from '../lib/ageGroups';
import { motion, AnimatePresence } from 'framer-motion';
import { PrintableReport } from './PrintableReport';

interface ReportsProps {
  students: Student[];
}

interface ChartData {
  metric: string;
  Football?: number;
  Athletics?: number;
}

interface StatusData {
  name: string;
  value: number;
}

const STATUS_COLORS = {
  selected: '#22c55e',  // green-500
  eliminated: '#ef4444', // red-500
  pending: '#94a3b8'    // gray-400
};

export function Reports({ students }: ReportsProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    school: 'all',
    sport: 'all' as 'all' | 'football' | 'athletics',
    status: 'all' as 'all' | 'pending' | 'selected' | 'eliminated',
    ageGroup: 'all',
    minAge: '',
    maxAge: '',
    sortField: 'name' as keyof Student,
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  const schools = useMemo(() => {
    const uniqueSchools = new Set(students.map(s => s.schoolName));
    return ['all', ...Array.from(uniqueSchools)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const ageGroup = ageGroups.calculateAgeGroup(student.dateOfBirth);
      const matchesAgeGroup = filters.ageGroup === 'all' || ageGroup === filters.ageGroup;
      const matchesSchool = filters.school === 'all' || student.schoolName === filters.school;
      const matchesSport = filters.sport === 'all' || 
        (filters.sport === 'football' && student.evaluations.football) ||
        (filters.sport === 'athletics' && student.evaluations.athletics);
      const matchesStatus = filters.status === 'all' || student.status === filters.status;
      
      const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
      const matchesAge = (!filters.minAge || age >= parseInt(filters.minAge)) && 
                        (!filters.maxAge || age <= parseInt(filters.maxAge));

      return matchesSchool && matchesSport && matchesStatus && matchesAge && matchesAgeGroup;
    }).sort((a, b) => {
      const aValue = String(a[filters.sortField] || '');
      const bValue = String(b[filters.sortField] || '');
      return filters.sortOrder === 'asc' ? 
        aValue.localeCompare(bValue) :
        bValue.localeCompare(aValue);
    });
  }, [students, filters]);

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
      },
      ageGroups: {} as Record<string, number>
    };

    // Calculate age group distribution
    filteredStudents.forEach(student => {
      const ageGroup = ageGroups.calculateAgeGroup(student.dateOfBirth);
      stats.ageGroups[ageGroup] = (stats.ageGroups[ageGroup] || 0) + 1;
    });

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
    if (filters.sport === 'all' || filters.sport === 'football') {
      Object.entries(statistics.averageScores.football).forEach(([metric, score]) => {
        data.push({
          metric,
          Football: Number(score.toFixed(2))
        });
      });
    }
    if (filters.sport === 'all' || filters.sport === 'athletics') {
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
  }, [statistics, filters.sport]);

  const statusData: StatusData[] = useMemo(() => {
    return [
      { name: 'Selected', value: statistics.statusCounts.selected },
      { name: 'Eliminated', value: statistics.statusCounts.eliminated },
      { name: 'Pending', value: statistics.statusCounts.pending }
    ];
  }, [statistics]);

  const ageGroupData = useMemo(() => {
    return Object.entries(statistics.ageGroups).map(([group, count]) => ({
      name: group,
      value: count
    }));
  }, [statistics]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-xl font-semibold text-gray-900">Performance Reports</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300 text-gray-700'
            }`}
          >
            <Filter size={20} />
            Filters
            <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => exportToCSV(filteredStudents, `talent-scout-report.csv`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => exportToPDF(filteredStudents, statistics)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={() => {
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Talent Scout Report</title>
                      <link href="${window.location.origin}/src/index.css" rel="stylesheet">
                    </head>
                    <body>
                      <div id="report">
                        ${document.getElementById('printable-report')?.innerHTML}
                      </div>
                    </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.print();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white rounded-lg shadow-sm p-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <select
                  value={filters.school}
                  onChange={(e) => setFilters({ ...filters, school: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {schools.map(school => (
                    <option key={school} value={school}>
                      {school === 'all' ? 'All Schools' : school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                <select
                  value={filters.sport}
                  onChange={(e) => setFilters({ ...filters, sport: e.target.value as typeof filters.sport })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sports</option>
                  <option value="football">Football</option>
                  <option value="athletics">Athletics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as typeof filters.status })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="selected">Selected</option>
                  <option value="eliminated">Eliminated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select
                  value={filters.ageGroup}
                  onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ages</option>
                  <option value="U10">Under 10</option>
                  <option value="U12">Under 12</option>
                  <option value="U14">Under 14</option>
                  <option value="U16">Under 16</option>
                  <option value="U18">Under 18</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                <input
                  type="number"
                  value={filters.minAge}
                  onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                  placeholder="Min age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                <input
                  type="number"
                  value={filters.maxAge}
                  onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                  placeholder="Max age"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortField}
                  onChange={(e) => setFilters({ ...filters, sortField: e.target.value as keyof Student })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="schoolName">School</option>
                  <option value="dateOfBirth">Age</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg shadow"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-semibold">{statistics.totalStudents}</p>
        </motion.div>
        {/* ... Other stat cards ... */}
      </div>

      {/* Charts Grid */}
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
                {(filters.sport === 'all' || filters.sport === 'football') && (
                  <Bar dataKey="Football" fill="#3b82f6" />
                )}
                {(filters.sport === 'all' || filters.sport === 'athletics') && (
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
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(STATUS_COLORS)[index]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Age Group Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Student Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
                  Age Group
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
              {filteredStudents.map((student) => {
                const footballAvg = student.evaluations.football
                  ? (Object.values(student.evaluations.football.scores).reduce((a, b) => a + b, 0) /
                     Object.values(student.evaluations.football.scores).length).toFixed(1)
                  : 'N/A';

                const athleticsAvg = student.evaluations.athletics
                  ? (Object.values(student.evaluations.athletics.scores).reduce((a, b) => a + b, 0) /
                     Object.values(student.evaluations.athletics.scores).length).toFixed(1)
                  : 'N/A';

                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                      {ageGroups.calculateAgeGroup(student.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {footballAvg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {athleticsAvg}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No students match the current filters</p>
          </div>
        )}
      </div>

      <DataManagement 
        onDataImported={() => {
          window.location.reload();
        }} 
      />

      {/* Add the printable report (hidden by default) */}
      <div id="printable-report" className="hidden">
        <PrintableReport
          students={filteredStudents}
          type={filters.school === 'all' ? 'summary' : 'school'}
          schoolName={filters.school === 'all' ? undefined : filters.school}
        />
      </div>
    </div>
  );
} 