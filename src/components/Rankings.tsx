import { useState } from 'react';
import { Student } from '../types';
import { rankings } from '../lib/rankings';
import { Medal, School, Users } from 'lucide-react';

interface RankingsProps {
  students: Student[];
}

export function Rankings({ students }: RankingsProps) {
  const [selectedSport, setSelectedSport] = useState<'overall' | 'football' | 'athletics'>('overall');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  const schools = ['all', ...new Set(students.map(s => s.schoolName))];
  const rankedStudents = rankings.getRankedStudents(students, {
    sport: selectedSport === 'overall' ? undefined : selectedSport,
    schoolFilter: selectedSchool === 'all' ? undefined : selectedSchool
  });
  const schoolRankings = rankings.getSchoolRankings(students);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Rankings</h2>
        <div className="flex gap-4">
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value as 'overall' | 'football' | 'athletics')}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="overall">Overall</option>
            <option value="football">Football</option>
            <option value="athletics">Athletics</option>
          </select>
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
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Medal className="h-5 w-5 text-yellow-500" />
              Top Performers
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {rankedStudents.slice(0, 10).map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full 
                      ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        student.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-700'}`}>
                      {student.rank}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.schoolName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {rankings.calculateStudentScore(student, 
                        selectedSport === 'overall' ? undefined : selectedSport
                      ).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Rankings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <School className="h-5 w-5 text-blue-500" />
              School Rankings
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {schoolRankings.map((school, index) => (
                <div key={school.school} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{school.school}</p>
                      <p className="text-sm text-gray-500">{school.studentCount} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{school.averageScore.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">Avg Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 