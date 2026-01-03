import React, { useState } from 'react';

const ClassCalendar = ({ classSessions, tutors, students, subjects, onAddSession, onUpdateSession }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSession, setNewSession] = useState({
    studentId: '',
    tutorId: '',
    subject: '',
    date: selectedDate,
    duration: 1,
    topics: ''
  });

  const handleAddSession = () => {
    if (newSession.studentId && newSession.tutorId && newSession.subject) {
      const student = students.find(s => s.id === parseInt(newSession.studentId));
      const tutor = tutors.find(t => t.id === parseInt(newSession.tutorId));
      
      const session = {
        ...newSession,
        studentName: student.name,
        tutorName: tutor.name,
        amount: newSession.duration * tutor.hourlyRate,
        status: 'completed'
      };
      
      onAddSession(session);
      setNewSession({
        studentId: '',
        tutorId: '',
        subject: '',
        date: selectedDate,
        duration: 1,
        topics: ''
      });
      setShowAddModal(false);
    }
  };

  const sessionsForDate = classSessions.filter(session => 
    session.date === selectedDate
  );

  const calculateTutorEarnings = (tutorId, month) => {
    const tutorSessions = classSessions.filter(
      session => session.tutorId === tutorId && 
      session.date.startsWith(month.slice(0, 7))
    );
    return tutorSessions.reduce((total, session) => total + session.amount, 0);
  };

  const getStudentSubjects = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? Object.entries(student.assignments)
      .filter(([subject, assignment]) => assignment !== null)
      .map(([subject]) => subject) : [];
  };

  const getTutorSubjects = (tutorId) => {
    const tutor = tutors.find(t => t.id === tutorId);
    return tutor ? tutor.subjects : [];
  };

  const commonSubjects = (studentId, tutorId) => {
    const studentSubjects = getStudentSubjects(studentId);
    const tutorSubjects = getTutorSubjects(tutorId);
    return studentSubjects.filter(subject => tutorSubjects.includes(subject));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Class Calendar</h3>
          <p className="text-gray-600">Track and manage all class sessions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Class Session
        </button>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Sessions for Selected Date */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Sessions on {new Date(selectedDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h4>
        
        {sessionsForDate.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessionsForDate.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-bold text-gray-800">{session.subject}</h5>
                    <p className="text-sm text-gray-600">{session.duration} hour(s)</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                    ₹{session.amount}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Student:</span>
                    <span className="ml-2 text-gray-700">{session.studentName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Tutor:</span>
                    <span className="ml-2 text-gray-700">{session.tutorName}</span>
                  </div>
                  
                  {session.topics && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Topics:</span>
                      <p className="text-gray-600 mt-1">{session.topics}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">No classes scheduled for this date</p>
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add Class Session</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student
                  </label>
                  <select
                    value={newSession.studentId}
                    onChange={(e) => setNewSession({...newSession, studentId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tutor
                  </label>
                  <select
                    value={newSession.tutorId}
                    onChange={(e) => setNewSession({...newSession, tutorId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Tutor</option>
                    {tutors.map(tutor => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.name} (₹{tutor.hourlyRate}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                {newSession.studentId && newSession.tutorId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={newSession.subject}
                      onChange={(e) => setNewSession({...newSession, subject: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Subject</option>
                      {commonSubjects(parseInt(newSession.studentId), parseInt(newSession.tutorId)).map(subject => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newSession.duration}
                    onChange={(e) => setNewSession({...newSession, duration: parseFloat(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topics Covered
                  </label>
                  <textarea
                    value={newSession.topics}
                    onChange={(e) => setNewSession({...newSession, topics: e.target.value})}
                    rows="3"
                    placeholder="Enter topics covered in this session..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {newSession.tutorId && newSession.duration > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Estimated Amount: ₹{(newSession.duration * tutors.find(t => t.id === parseInt(newSession.tutorId))?.hourlyRate || 0).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSession}
                  disabled={!newSession.studentId || !newSession.tutorId || !newSession.subject}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                    !newSession.studentId || !newSession.tutorId || !newSession.subject
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Add Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassCalendar;