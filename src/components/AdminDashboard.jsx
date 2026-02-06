import React, { useState, useEffect } from 'react';
import StudentList from './StudentList';
import TutorAssignmentModal from './TutorAssignmentModal';
import TutorManagement from './TutorManagement';
import PaymentManagement from './PaymentManagement';
import RevenueManagement from '../pages/RevenueManagement';
import Reports from '../pages/Reports';
import axios from 'axios';
import {
  students as initialStudents,
  tutors as initialTutors,
  subjects,
  classSessions as initialClassSessions,
  payments as initialPayments,
  monthlyReports as initialMonthlyReports
} from '../data/dummyData';
import LoadingPage from './LoadingPage';
import AddStudentModal from './AddStudentModal';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard'
import StatusCard from './StatusCard';

const AdminDashboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [allTutors, setAllTutors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('students');
  const [studentModalOpen, setStudentModalOpen] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [classSessions, setClassSessions] = useState(initialClassSessions);
  const [payments, setPayments] = useState(initialPayments);
  const [monthlyReports, setMonthlyReports] = useState(initialMonthlyReports);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  }

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

      // console.log(response.data.students);
      const transformed = transformation(response.data.students);
      // console.log(transformed);

      setAllStudents(transformed);
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
      const tutors = response.data.teachers;
      console.log(response.data.teachers);
      setAllTutors(tutors);
      // const transformed = transformation(response.data.students);
      // console.log(transformed);

      // setAllTutors(response.data.tutors);

    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    console.log(localStorage.getItem("token"));

    fetchStudents();
    fetchTutors();
  }, []);

  const transformation = (rawStudents) => {
    return rawStudents.map((student, index) => {
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

  if (loading) return <LoadingPage />;
  if (error) return <p>{error}</p>;



  const handleSendPaymentRequest = (studentId, invoiceDetails) => {
    alert(`Payment request sent to ${invoiceDetails.student.name}\n\nAmount: ₹${invoiceDetails.bill.totalAmount}\nUPI Link: ${generateUPIUrl(invoiceDetails.bill.totalAmount, invoiceDetails.student.upiId, invoiceDetails.student.name)}`);
  };

  const handleUpdatePaymentStatus = (studentId, status) => {
    const updatedStudents = allStudents.map(student =>
      student.id === studentId ? { ...student, paymentStatus: status } : student
    );
    setAllStudents(updatedStudents);

    // Add payment record
    const student = allStudents.find(s => s.id === studentId);
    const newPayment = {
      id: payments.length + 1,
      type: 'student_to_admin',
      studentId,
      studentName: student.name,
      amount: calculateStudentBill(studentId).totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      paymentMethod: 'Manual Update',
      transactionId: `MAN${Date.now()}`,
      month: selectedMonth,
      description: 'Manual payment update'
    };

    setPayments([...payments, newPayment]);
    alert(`Payment status updated to ${status} for ${student.name}`);
  };

  const handlePayTutor = (tutorId, amount) => {
    const tutor = allTutors.find(t => t.id === tutorId);
    const newPayment = {
      id: payments.length + 1,
      type: 'admin_to_tutor',
      tutorId,
      tutorName: tutor.name,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      transactionId: `TUT${Date.now()}`,
      month: selectedMonth,
      description: `Salary for ${selectedMonth}`
    };

    setPayments([...payments, newPayment]);
    alert(`Payment of ₹${amount} processed for ${tutor.name}`);
  };

  const handleAddClassSession = (session) => {
    const newSession = {
      ...session,
      id: classSessions.length + 1
    };
    setClassSessions([...classSessions, newSession]);
    alert(`Class session added successfully for ${session.studentName}`);
  };

  // Helper function to generate UPI URL
  const generateUPIUrl = (amount, upiId, name) => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&tn=Tuition%20Fee&cu=INR`;
  };

  // Helper function to calculate student bill
  const calculateStudentBill = (studentId) => {
    const studentSessions = classSessions.filter(
      session => session.studentId === studentId &&
        session.date.startsWith(selectedMonth)
    );

    return {
      totalAmount: studentSessions.reduce((sum, session) => sum + session.amount, 0),
      totalSessions: studentSessions.length,
      totalHours: studentSessions.reduce((sum, session) => sum + session.duration, 0)
    };
  };


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const handleAddStudent = async (studentData) => {
    console.log("Student Created:", studentData);
    // 🔥 Call API here
    try {
      const response = await axios.post(
        'https://justute.onrender.com/api/admin/login',
        {
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(response);
    } catch (error) {
      console.log(error);

    }
  };
  const handleAssignClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };


  //tuturid,studentid,subject
  const handleAssignTutors = async (studentId, newAssignments) => {
    console.log(newAssignments)
    try {
      const response = await axios.patch(
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

      console.log("Tutor assignments updated:", response.data);
    } catch (error) {
      console.error(
        "Error assigning tutors:",
        error.response?.data || error.message
      );
      throw error;
    }



    // // First check if any assigned tutor can still teach the subject
    // const invalidAssignments = [];
    // Object.entries(newAssignments).forEach(([subject, assignment]) => {
    //   if (assignment) {
    //     const tutor = allTutors.find(t => t.id === assignment.tutorId);
    //     if (tutor && !tutor.subjects.includes(subject)) {
    //       invalidAssignments.push({ subject, tutorName: assignment.tutorName });
    //     }
    //   }
    // });

    // if (invalidAssignments.length > 0) {
    //   alert(`Cannot save: Some tutors no longer teach these subjects:\n${invalidAssignments.map(ia => `${ia.subject} (${ia.tutorName})`).join('\n')
    //     }`);
    //   return;
    // }

    // const updatedStudents = allStudents.map(student => {
    //   if (student.id === studentId) {
    //     const assignedCount = Object.values(newAssignments).filter(
    //       assignment => assignment !== null
    //     ).length;
    //     const totalSubjects = subjects.length;

    //     let newStatus = 'partially';
    //     if (assignedCount === 0) newStatus = 'unassigned';
    //     if (assignedCount === totalSubjects) newStatus = 'assigned';

    //     return {
    //       ...student,
    //       assignments: newAssignments,
    //       status: newStatus
    //     };
    //   }
    //   return student;
    // });

    // setAllStudents(updatedStudents);
    fetchStudents();
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
      alert(`Tutor updated successfully!\n\nNote: ${updatedTutor.name} no longer teaches these subjects:\n${affectedStudents.map(as => `${as.subject} (assigned to ${as.studentName})`).join('\n')
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
    <>
      <div className="min-h-screen bg-gray-100 font-BarlowCondensed">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
          <div className="mx-auto px-9 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  JustTute<span className="text-indigo-600">.</span>
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-8 w-px bg-gray-200 mx-2" /> {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 leading-none">Admin User</p>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1">Platform Manager</p>
                  </div>
                  <button
                    onClick={() => handleLogout()}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h2>
              <p className="text-gray-500 mt-1 font-medium">Monitoring platform activity and assignment health.</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                Real-time updates active
              </span>
            </div>
          </div>

          {/* Primary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <StatCard label="Total Students" value={stats.total} icon="👤" />
            <StatCard label="Active Tutors" value={stats.totalTutors} icon="🎓" />
            <StatCard label="Subjects" value={stats.availableSubjects} icon="📚" />
          </div>

          {/* Status Cards - More interactive and visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatusCard
              label="Fully Assigned"
              value={stats.fullyAssigned}
              color="emerald"
              percentage={(stats.fullyAssigned / stats.total * 100).toFixed(0)}
            />
            <StatusCard
              label="Pending Partial"
              value={stats.partiallyAssigned}
              color="amber"
              percentage={(stats.partiallyAssigned / stats.total * 100).toFixed(0)}
            />
            <StatusCard
              label="Unassigned"
              value={stats.unassigned}
              color="rose"
              percentage={(stats.unassigned / stats.total * 100).toFixed(0)}
            />
          </div>


          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
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
        </div> */}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'students'
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'tutors'
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

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Payment Management
                    <span className="ml-2 bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Payments
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('revenue')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'revenue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Revenue Analytics
                    <span className="ml-2 bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Finance
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Reports
                    <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Analytics
                    </span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'students' && (
            <div className="space-y-8">
              {/* Student List Section */}
              <div className="bg-white rounded-lg mb-10 shadow">
                <div className="flex justify-between px-6 pt-4 items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Student Management</h2>
                    <p className="text-gray-600">Manage tutor assignments for all students</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStudentModalOpen(true)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
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
          )}
          {activeTab === 'tutors' && (
            <TutorManagement
              tutors={allTutors}
              onUpdateTutor={handleUpdateTutor}
            />
          )}
          {activeTab === 'payments' && (
            <PaymentManagement
              students={allStudents}
              tutors={allTutors}
              classSessions={classSessions}
              payments={payments}
              onSendPaymentRequest={handleSendPaymentRequest}
              onUpdatePaymentStatus={handleUpdatePaymentStatus}
              onPayTutor={handlePayTutor}
            />
          )}
          {activeTab === 'revenue' && (
            <RevenueManagement
              payments={payments}
              monthlyReports={monthlyReports}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              monthlyReports={monthlyReports}
              students={allStudents}
              tutors={allTutors}
              classSessions={classSessions}
              payments={payments}
            />
          )}
        </main>

        {/* Assignment Modal */}
        {selectedStudent && (
          <TutorAssignmentModal
            student={selectedStudent}
            subjects={selectedStudent.subjects}
            tutors={allTutors}
            onClose={handleCloseModal}
            onAssign={handleAssignTutors}
            isOpen={isModalOpen}
          />
        )}
        {
          studentModalOpen && (
            <AddStudentModal
              isOpen={studentModalOpen}
              Submit={handleAddStudent}
              onClose={() => setStudentModalOpen(false)}
            />)
        }
      </div>
    </>
  );
};

export default AdminDashboard;