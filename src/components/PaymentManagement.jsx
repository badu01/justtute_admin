import React, { useState } from 'react';
import ClassCalendar from './ClassCalendar';
const PaymentManagement = ({ 
  students, 
  tutors, 
  classSessions, 
  payments, 
  onSendPaymentRequest,
  onUpdatePaymentStatus,
  onPayTutor 
}) => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  // Calculate student bills
  const calculateStudentBill = (studentId) => {
    const studentSessions = classSessions.filter(
      session => session.studentId === studentId &&
      session.date.startsWith(selectedMonth)
    );
    
    const totalAmount = studentSessions.reduce((sum, session) => sum + session.amount, 0);
    
    const subjectBreakdown = {};
    studentSessions.forEach(session => {
      if (!subjectBreakdown[session.subject]) {
        subjectBreakdown[session.subject] = {
          totalHours: 0,
          totalAmount: 0,
          sessions: []
        };
      }
      subjectBreakdown[session.subject].totalHours += session.duration;
      subjectBreakdown[session.subject].totalAmount += session.amount;
      subjectBreakdown[session.subject].sessions.push(session);
    });

    return {
      totalAmount,
      subjectBreakdown,
      totalSessions: studentSessions.length,
      totalHours: studentSessions.reduce((sum, session) => sum + session.duration, 0)
    };
  };

  // Calculate tutor earnings
  const calculateTutorEarnings = (tutorId) => {
    const tutorSessions = classSessions.filter(
      session => session.tutorId === tutorId &&
      session.date.startsWith(selectedMonth)
    );
    
    const totalAmount = tutorSessions.reduce((sum, session) => sum + session.amount, 0);
    
    const studentBreakdown = {};
    tutorSessions.forEach(session => {
      if (!studentBreakdown[session.studentId]) {
        studentBreakdown[session.studentId] = {
          studentName: session.studentName,
          totalHours: 0,
          totalAmount: 0,
          sessions: []
        };
      }
      studentBreakdown[session.studentId].totalHours += session.duration;
      studentBreakdown[session.studentId].totalAmount += session.amount;
      studentBreakdown[session.studentId].sessions.push(session);
    });

    return {
      totalAmount,
      studentBreakdown,
      totalSessions: tutorSessions.length,
      totalHours: tutorSessions.reduce((sum, session) => sum + session.duration, 0)
    };
  };

  const generateUPIUrl = (amount, upiId, studentName) => {
    const note = `Tuition Fee for ${studentName} - ${selectedMonth}`;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(studentName)}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
  };

  const generateWhatsAppMessage = (student, bill) => {
    const message = `Dear ${student.name},\n\nYour tuition fee invoice for ${selectedMonth}:\n\nTotal Amount: ₹${bill.totalAmount}\nTotal Sessions: ${bill.totalSessions}\nTotal Hours: ${bill.totalHours}\n\nPlease pay via UPI: ${generateUPIUrl(bill.totalAmount, student.upiId, student.name)}\n\nThank you!`;
    return encodeURIComponent(message);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Payment Management</h2>
            <p className="text-green-100">Manage student payments and tutor salaries</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-black border border-green-300 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="2024-01">January 2024</option>
                <option value="2024-02">February 2024</option>
                <option value="2024-03">March 2024</option>
                <option value="2024-04">April 2024</option>
                <option value="2024-05">May 2024</option>
              </select>
              <button className="px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors font-medium">
                Generate All Invoices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'students'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Student Payments
              <span className="ml-2 bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {students.length}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('tutors')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'tutors'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tutor Payments
              <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {tutors.length}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Class Calendar
            </div>
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="p-6">
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800">Total Receivable</div>
                <div className="text-2xl font-bold text-green-900 mt-2">
                  ₹{students.reduce((sum, student) => sum + calculateStudentBill(student.id).totalAmount, 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800">Pending Payments</div>
                <div className="text-2xl font-bold text-blue-900 mt-2">
                  {students.filter(s => s.paymentStatus === 'pending').length}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800">Total Sessions</div>
                <div className="text-2xl font-bold text-purple-900 mt-2">
                  {classSessions.filter(s => s.date.startsWith(selectedMonth)).length}
                </div>
              </div>
            </div>

            {/* Student Payment List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const bill = calculateStudentBill(student.id);
                    const studentPayments = payments.filter(
                      p => p.studentId === student.id && p.type === 'student_to_admin'
                    );
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.grade} • {student.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{bill.totalSessions} sessions</div>
                          <div className="text-xs text-gray-500">{bill.totalHours} hours</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">₹{bill.totalAmount.toLocaleString('en-IN')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() => {
                              const invoiceDetails = {
                                student,
                                bill,
                                month: selectedMonth,
                                breakdown: bill.subjectBreakdown
                              };
                              onSendPaymentRequest(student.id, invoiceDetails);
                            }}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium"
                          >
                            Send Invoice
                          </button>
                          <button
                            onClick={() => window.open(`https://wa.me/+91${student.phone}?text=${generateWhatsAppMessage(student, bill)}`)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                          >
                            WhatsApp
                          </button>
                          <button
                            onClick={() => onUpdatePaymentStatus(student.id, 'paid')}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                          >
                            Mark Paid
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tutors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm font-medium text-red-800">Total Payable</div>
                <div className="text-2xl font-bold text-red-900 mt-2">
                  ₹{tutors.reduce((sum, tutor) => sum + calculateTutorEarnings(tutor.id).totalAmount, 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm font-medium text-yellow-800">Pending Payouts</div>
                <div className="text-2xl font-bold text-yellow-900 mt-2">
                  {tutors.filter(t => calculateTutorEarnings(t.id).totalAmount > 0).length}
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="text-sm font-medium text-indigo-800">Active Tutors</div>
                <div className="text-2xl font-bold text-indigo-900 mt-2">
                  {tutors.filter(t => calculateTutorEarnings(t.id).totalSessions > 0).length}
                </div>
              </div>
            </div>

            {/* Tutor Payment List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => {
                const earnings = calculateTutorEarnings(tutor.id);
                
                return (
                  <div key={tutor.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Rate: ₹{tutor.hourlyRate}/hr</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        ₹{earnings.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Sessions:</span>
                        <span className="font-medium">{earnings.totalSessions}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">Total Hours:</span>
                        <span className="font-medium">{earnings.totalHours}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Hourly Rate:</span>
                        <span className="font-medium">₹{tutor.hourlyRate}</span>
                      </div>
                    </div>

                    {Object.keys(earnings.studentBreakdown).length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Students:</p>
                        <div className="space-y-2">
                          {Object.values(earnings.studentBreakdown).map((studentEarning, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600 truncate">{studentEarning.studentName}</span>
                              <span className="font-medium">₹{studentEarning.totalAmount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onPayTutor(tutor.id, earnings.totalAmount)}
                        disabled={earnings.totalAmount === 0}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          earnings.totalAmount === 0
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={() => {
                          // Show detailed invoice
                          alert(`Invoice for ${tutor.name}\n\nTotal: ₹${earnings.totalAmount}\nSessions: ${earnings.totalSessions}\nHours: ${earnings.totalHours}`);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <ClassCalendar
            classSessions={classSessions}
            tutors={tutors}
            students={students}
            subjects={[]} // We'll pass subjects from parent
            onAddSession={() => {}}
            onUpdateSession={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;