import React from 'react';
import { subjects } from '../data/dummyData';

const StudentList = ({ students, onAssignClick}) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'unassigned': return 'bg-red-100 text-red-800';
      case 'partially': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'assigned': return '✓';
      case 'unassigned': return '✗';
      case 'partially': return '⚠';
      default: return '';
    }
  };

  const countAssignedSubjects = (assignments) => {
    return Object.values(assignments).filter(assignment => assignment !== null).length;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subjects Assigned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const assignedCount = countAssignedSubjects(student.assignments);
              const totalSubjects = student.subjects.length;
              
              return (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {assignedCount}/{totalSubjects} subjects
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.subjects.map((subject) => (
                        <span
                          key={subject}
                          className={`inline-block px-2 py-1 text-xs rounded ${
                            student.assignments[subject]
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          title={student.assignments[subject] ? `Tutor: ${student.assignments[subject].tutorName}` : 'Not assigned'}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      <span className="mr-1">{getStatusIcon(student.status)}</span>
                      {student.status === 'assigned' ? 'Fully Assigned' :
                       student.status === 'unassigned' ? 'Not Assigned' :
                       'Partially Assigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onAssignClick(student)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        student.status === 'assigned'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {student.status === 'assigned' ? 'Modify Assignments' : 'Assign Tutors'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;