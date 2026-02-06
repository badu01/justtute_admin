import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';
import TutorAssignmentModal from '../components/TutorAssignmentModal';
import AddStudentModal from '../components/AddStudentModal';
import LoadingPage from '../components/LoadingPage';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tutors, setTutors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchTutors();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "https://justute.onrender.com/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const transformed = transformation(response.data.students);
      setStudents(transformed);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await axios.get(
        "https://justute.onrender.com/api/admin/teachers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTutors(response.data.teachers);
    } catch (err) {
      console.error(err);
    }
  };

  const transformation = (rawStudents) => {
    return rawStudents.map((student) => {
      const assignments = {};
      student.subjects.forEach((subject) => (assignments[subject] = null));

      student.teachers.forEach(({ subject, teacher }) => {
        assignments[subject] = {
          tutorId: teacher?._id,
          tutorName: teacher?.name,
        };
      });

      const assignedCount = Object.values(assignments).filter(Boolean).length;

      let status = "unassigned";
      if (assignedCount == student.subjects.length) status = "assigned";
      else if (assignedCount > 0) status = "partially";

      return {
        id: student._id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        phone: student.phone,
        subjects: student.subjects,
        assignments,
        status,
      };
    });
  };

  const handleAssignClick = (student) => {
    setSelectedStudent(student);
    setIsAssignmentModalOpen(true);
  };

  const handleCloseAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setSelectedStudent(null);
  };

  const handleAssignTutors = async (studentId, newAssignments) => {
    try {
      await axios.patch(
        "https://justute.onrender.com/api/admin/assign-tutor",
        {
          studentId,
          assignments: newAssignments
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchStudents(); // Refresh students data
      setIsAssignmentModalOpen(false);
      setSelectedStudent(null);
      alert('Tutor assignments saved successfully!');
    } catch (error) {
      console.error("Error assigning tutors:", error.response?.data || error.message);
      alert('Failed to assign tutors');
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      const response = await axios.post(
        'https://justute.onrender.com/api/admin/student',
        studentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Student created:', response.data);
      fetchStudents(); // Refresh list
      setIsAddStudentModalOpen(false);
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };

  const filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) return <LoadingPage />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Student Management</h2>
          <p className="text-gray-600 mt-1">Manage all student records and assignments</p>
        </div>
        <div className="flex space-x-3">
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
          <button
            onClick={() => setIsAddStudentModalOpen(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Add New Student
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      <StudentList
        students={filteredStudents}
        onAssignClick={handleAssignClick}
      />

      {/* Modals */}
      {selectedStudent && (
        <TutorAssignmentModal
          student={selectedStudent}
          subjects={selectedStudent.subjects}
          tutors={tutors}
          onClose={handleCloseAssignmentModal}
          onAssign={handleAssignTutors}
          isOpen={isAssignmentModalOpen}
        />
      )}

      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        Submit={handleAddStudent}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
    </div>
  );
};

export default StudentManagement;