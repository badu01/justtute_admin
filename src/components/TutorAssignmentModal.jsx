import React, { useState } from 'react';
import { tutors } from '../data/dummyData';

const TutorAssignmentModal = ({ student, subjects,tutors, onClose, onAssign, isOpen }) => {
  const [assignments, setAssignments] = useState({ ...student.assignments });

  if (!isOpen) return null;

  const getTutorsForSubject = (subject) => {
    return tutors.filter(tutor => tutor.subjects.includes(subject));
  };

  const handleAssignmentChange = (subject, tutorId) => {
    const tutor = tutors.find(t => t.id === parseInt(tutorId));
    setAssignments({
      ...assignments,
      [subject]: tutorId ? { tutorId: tutor.id, tutorName: tutor.name } : null
    });
  };

  const handleSubmit = () => {
    onAssign(student.id, assignments);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'unassigned': return 'bg-red-100 text-red-800';
      case 'partially': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Assign Tutors to {student.name}</h2>
              <p className="text-gray-600">Grade: {student.grade} | Email: {student.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(student.status)}`}>
                {student.status === 'assigned' ? '✓ All Subjects Assigned' : 
                 student.status === 'unassigned' ? '✗ No Tutors Assigned' : 
                 '⚠ Partially Assigned'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => {
              const subjectTutors = getTutorsForSubject(subject);
              const currentAssignment = assignments[subject];
              
              return (
                <div key={subject} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-700">{subject}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${currentAssignment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currentAssignment ? 'Assigned' : 'Not Assigned'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentAssignment?.tutorId || ''}
                      onChange={(e) => handleAssignmentChange(subject, e.target.value)}
                    >
                      <option value="">Select a tutor...</option>
                      {subjectTutors.map((tutor) => (
                        <option key={tutor.id} value={tutor.id}>
                          {tutor.name} ({tutor.experience}) - {tutor.email}
                        </option>
                      ))}
                    </select>
                    
                    {currentAssignment && (
                      <div className="p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          Currently assigned to: <span className="font-semibold">{currentAssignment.tutorName}</span>
                        </p>
                      </div>
                    )}
                    
                    {!currentAssignment && subjectTutors.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {subjectTutors.length} tutor(s) available for this subject
                      </p>
                    )}
                    
                    {!currentAssignment && subjectTutors.length === 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        No tutors available for this subject
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorAssignmentModal;