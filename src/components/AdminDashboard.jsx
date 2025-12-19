import React, { useState } from 'react';
import StudentList from './StudentList';
import TutorAssignmentModal from './TutorAssignmentModal';
import TutorManagement from './TutorManagement';
import { students, tutors, subjects } from '../data/dummyData';

const AdminDashboard = () => {
  const [allStudents, setAllStudents] = useState(students);
  const [allTutors, setAllTutors] = useState(tutors);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');

  const handleAssignClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleAssignTutors = (studentId, newAssignments) => {
    // First check if any assigned tutor can still teach the subject
    const invalidAssignments = [];
    Object.entries(newAssignments).forEach(([subject, assignment]) => {
      if (assignment) {
        const tutor = allTutors.find(t => t.id === assignment.tutorId);
        if (tutor && !tutor.subjects.includes(subject)) {
          invalidAssignments.push({ subject, tutorName: assignment.tutorName });
        }
      }
    });

    if (invalidAssignments.length > 0) {
      alert(`Cannot save: Some tutors no longer teach these subjects:\n${
        invalidAssignments.map(ia => `${ia.subject} (${ia.tutorName})`).join('\n')
      }`);
      return;
    }

    const updatedStudents = allStudents.map(student => {
      if (student.id === studentId) {
        const assignedCount = Object.values(newAssignments).filter(
          assignment => assignment !== null
        ).length;
        const totalSubjects = subjects.length;
        
        let newStatus = 'partially';
        if (assignedCount === 0) newStatus = 'unassigned';
        if (assignedCount === totalSubjects) newStatus = 'assigned';
        
        return {
          ...student,
          assignments: newAssignments,
          status: newStatus
        };
      }
      return student;
    });
    
    setAllStudents(updatedStudents);
    setIsModalOpen(false);
    setSelectedStudent(null);
    alert('Tutor assignments saved successfully!');
  };

  const handleUpdateTutor = (updatedTutor) => {
    const updatedTutors = allTutors.map(tutor => 
      tutor.id === updatedTutor.id ? updatedTutor : tutor
    );
    setAllTutors(updatedTutors);
    
    // Check if any students have assignments with tutors that no longer teach the subject
    let affectedStudents = [];
    allStudents.forEach(student => {
      Object.entries(student.assignments).forEach(([subject, assignment]) => {
        if (assignment && assignment.tutorId === updatedTutor.id) {
          if (!updatedTutor.subjects.includes(subject)) {
            affectedStudents.push({
              studentName: student.name,
              subject,
              tutorName: assignment.tutorName
            });
          }
        }
      });
    });

    if (affectedStudents.length > 0) {
      alert(`Tutor updated successfully!\n\nNote: ${updatedTutor.name} no longer teaches these subjects:\n${
        affectedStudents.map(as => `${as.subject} (assigned to ${as.studentName})`).join('\n')
      }\n\nPlease reassign these students.`);
    } else {
      alert('Tutor updated successfully!');
    }
  };

  const stats = {
    total: allStudents.length,
    fullyAssigned: allStudents.filter(s => s.status === 'assigned').length,
    partiallyAssigned: allStudents.filter(s => s.status === 'partially').length,
    unassigned: allStudents.filter(s => s.status === 'unassigned').length,
    totalTutors: allTutors.length,
    availableSubjects: [...new Set(allTutors.flatMap(t => t.subjects))].length
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-linear-to-r from-blue-700 to-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Tuition Management System
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Admin Dashboard - Manage students, tutors, and assignments
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-2">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-xs text-blue-100">Logged in as</p>
                  <p className="text-sm font-semibold text-white">Admin User</p>
                </div>
                <button className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="rounded-md bg-blue-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.65-1.931 1-3 1s-2.034-.35-3-1m-6 0c-.966.65-1.931 1-3 1s-2.034-.35-3-1" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Students</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="rounded-md bg-green-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Fully Assigned</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.fullyAssigned}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="rounded-md bg-yellow-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Partial</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.partiallyAssigned}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="rounded-md bg-red-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Unassigned</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.unassigned}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="rounded-md bg-purple-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Tutors</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalTutors}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="rounded-md bg-indigo-500 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">Subjects</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.availableSubjects}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.65-1.931 1-3 1s-2.034-.35-3-1m-6 0c-.966.65-1.931 1-3 1s-2.034-.35-3-1" />
                  </svg>
                  Student Management
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {allStudents.length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('tutors')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tutors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Tutor Management
                  <span className="ml-2 bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {allTutors.length}
                  </span>
                </div>
              </button>
              
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Reports
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'students' ? (
          <div className="space-y-8">
            {/* Student List Section */}
            <div className="bg-white shadow rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Student Management</h2>
                  <p className="text-gray-600">Manage tutor assignments for all students</p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Add New Student
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Export Report
                  </button>
                </div>
              </div>
              
              <StudentList 
                students={allStudents} 
                onAssignClick={handleAssignClick}
              />
            </div>
          </div>
        ) : (
          <TutorManagement 
            tutors={allTutors} 
            onUpdateTutor={handleUpdateTutor}
          />
        )}
      </main>

      {/* Assignment Modal */}
      {selectedStudent && (
        <TutorAssignmentModal
          student={selectedStudent}
          subjects={subjects}
          tutors={allTutors}
          onClose={handleCloseModal}
          onAssign={handleAssignTutors}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default AdminDashboard;