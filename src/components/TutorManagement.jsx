import React, { useState } from 'react';
import { subjects } from '../data/dummyData';
import { useNavigate } from 'react-router-dom';

const TutorManagement = ({ tutors, onUpdateTutor }) => {
  const [editingTutor, setEditingTutor] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleEditClick = (tutor) => {
    setEditingTutor(tutor);
    setSelectedSubjects([...tutor.subjects]);
  };

  const handleSubjectToggle = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSave = () => {
    if (editingTutor) {
      const updatedTutor = {
        ...editingTutor,
        subjects: selectedSubjects
      };
      onUpdateTutor(updatedTutor);
      setEditingTutor(null);
      setSelectedSubjects([]);
    }
  };

  const handleCancel = () => {
    setEditingTutor(null);
    setSelectedSubjects([]);
  };

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.subjects.some(subject =>
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="text-black p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold ">Tutor Management</h2>
            <p className="">Manage tutor subjects and availability</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tutors..."
              className="pl-10 pr-4 py-2 rounded-lg w-md bg-gray-400/20 border border-gray-400/30 bg-opacity-20 placeholder-gray-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tutor List */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{tutor.name}</h3>
                  <p className="text-sm text-gray-600">{tutor.email}</p>
                  <p className="text-xs text-gray-500 mt-1">{tutor.experience} experience</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tutor.availability === 'Full-time'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {tutor.availability}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Subjects:</span>
                  <span className="text-xs text-gray-500">{tutor.subjects.length} subject(s)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 font-semibold text-gray-700">{tutor.rating}</span>
                  <span className="ml-2 text-sm text-gray-600">| ₹{tutor.hourlyRate}/hr</span>
                </div>
                <button
                  onClick={() => navigate(`/admin/tutors/${tutor._id || tutor.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Tutor Subjects Modal */}
      {editingTutor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Edit Subjects for {editingTutor.name}</h3>
                  <p className="text-gray-600 text-sm">Select subjects this tutor can teach</p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Subjects: {selectedSubjects.length}</p>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedSubjects.includes(subject)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        }`}
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedSubjects.includes(subject)
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                          }`}>
                          {selectedSubjects.includes(subject) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-medium ${selectedSubjects.includes(subject) ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                          {subject}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    Warning: Changing subjects may affect existing student assignments.
                    {selectedSubjects.length === 0 && (
                      <span className="font-semibold block mt-1">⚠️ No subjects selected!</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={selectedSubjects.length === 0}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${selectedSubjects.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorManagement;