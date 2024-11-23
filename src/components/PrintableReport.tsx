import { Student } from '../types';
import { config } from '../lib/config';
import { ageGroups } from '../lib/ageGroups';

interface PrintableReportProps {
  students: Student[];
  type: 'individual' | 'school' | 'summary';
  schoolName?: string;
}

export function PrintableReport({ students, type, schoolName }: PrintableReportProps) {
  const getAverageScore = (student: Student, sport: 'football' | 'athletics') => {
    const evaluation = student.evaluations[sport];
    if (!evaluation) return 'N/A';
    return (
      Object.values(evaluation.scores).reduce((a, b) => a + b, 0) /
      Object.values(evaluation.scores).length
    ).toFixed(1);
  };

  const renderIndividualReport = (student: Student) => (
    <div className="page-break-after">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Student Evaluation Report</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Student Information</h2>
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium">Name:</td>
              <td>{student.name}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">School:</td>
              <td>{student.schoolName}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Age Group:</td>
              <td>{ageGroups.calculateAgeGroup(student.dateOfBirth)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Status:</td>
              <td className="capitalize">{student.status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {['football', 'athletics'].map((sport) => {
        const evaluation = student.evaluations[sport as 'football' | 'athletics'];
        if (!evaluation) return null;

        const metrics = config.getMetrics(sport);
        return (
          <div key={sport} className="mb-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">{sport} Evaluation</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Metric</th>
                  <th className="py-2 px-4 text-left">Score</th>
                  <th className="py-2 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id} className="border-b">
                    <td className="py-2 px-4">{metric.name}</td>
                    <td className="py-2 px-4">{evaluation.scores[metric.id]}/{metric.max}</td>
                    <td className="py-2 px-4">{metric.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {evaluation.comments && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Comments:</h3>
                <p className="text-gray-600">{evaluation.comments}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSchoolReport = () => {
    const schoolStudents = schoolName 
      ? students.filter(s => s.schoolName === schoolName)
      : students;

    return (
      <div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">School Performance Report</h1>
          <p className="text-gray-600">
            {schoolName || 'All Schools'} - {new Date().toLocaleDateString()}
          </p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Age Group</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Football Avg</th>
              <th className="py-2 px-4 text-left">Athletics Avg</th>
            </tr>
          </thead>
          <tbody>
            {schoolStudents.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{ageGroups.calculateAgeGroup(student.dateOfBirth)}</td>
                <td className="py-2 px-4 capitalize">{student.status}</td>
                <td className="py-2 px-4">{getAverageScore(student, 'football')}</td>
                <td className="py-2 px-4">{getAverageScore(student, 'athletics')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Total Students:</td>
                <td>{schoolStudents.length}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Selected:</td>
                <td>{schoolStudents.filter(s => s.status === 'selected').length}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Eliminated:</td>
                <td>{schoolStudents.filter(s => s.status === 'eliminated').length}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Pending:</td>
                <td>{schoolStudents.filter(s => s.status === 'pending').length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSummaryReport = () => (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Talent Scout Summary Report</h1>
        <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Overall Statistics</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">Total Students:</td>
                <td>{students.length}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Schools:</td>
                <td>{new Set(students.map(s => s.schoolName)).size}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Selected:</td>
                <td>{students.filter(s => s.status === 'selected').length}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Eliminated:</td>
                <td>{students.filter(s => s.status === 'eliminated').length}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Age Distribution</h2>
          <table className="w-full border-collapse">
            <tbody>
              {['U10', 'U12', 'U14', 'U16', 'U18'].map(group => (
                <tr key={group} className="border-b">
                  <td className="py-2 font-medium">{group}:</td>
                  <td>
                    {students.filter(s => 
                      ageGroups.calculateAgeGroup(s.dateOfBirth) === group
                    ).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">School Performance</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">School</th>
              <th className="py-2 px-4 text-left">Students</th>
              <th className="py-2 px-4 text-left">Selected</th>
              <th className="py-2 px-4 text-left">Eliminated</th>
              <th className="py-2 px-4 text-left">Pending</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(new Set(students.map(s => s.schoolName))).map(school => {
              const schoolStudents = students.filter(s => s.schoolName === school);
              return (
                <tr key={school} className="border-b">
                  <td className="py-2 px-4">{school}</td>
                  <td className="py-2 px-4">{schoolStudents.length}</td>
                  <td className="py-2 px-4">
                    {schoolStudents.filter(s => s.status === 'selected').length}
                  </td>
                  <td className="py-2 px-4">
                    {schoolStudents.filter(s => s.status === 'eliminated').length}
                  </td>
                  <td className="py-2 px-4">
                    {schoolStudents.filter(s => s.status === 'pending').length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-white print:p-0">
      {type === 'individual' && students.map(student => renderIndividualReport(student))}
      {type === 'school' && renderSchoolReport()}
      {type === 'summary' && renderSummaryReport()}
    </div>
  );
} 