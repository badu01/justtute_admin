import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingPage from '../../components/LoadingPage';

const StudentPayments = () => {
  const [students, setStudents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
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
      setStudents(response.data.students || []);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentBill = (student) => {
    // Mock calculation - replace with actual session data from your API
    const mockSessions = [
      { subject: 'Math', hours: 8, rate: 500, total: 4000 },
      { subject: 'Physics', hours: 6, rate: 500, total: 3000 },
      { subject: 'Chemistry', hours: 4, rate: 500, total: 2000 },
    ];
    
    const totalAmount = mockSessions.reduce((sum, session) => sum + session.total, 0);
    const totalHours = mockSessions.reduce((sum, session) => sum + session.hours, 0);
    
    return {
      totalAmount,
      totalSessions: mockSessions.length,
      totalHours,
      subjectBreakdown: mockSessions
    };
  };

  const generateUPIUrl = (amount, student) => {
    // Use phone number for UPI if UPI ID not available
    const upiId = student.phone ? `${student.phone}@upi` : 'default@upi';
    const note = `Tuition Fee for ${student.name} - ${selectedMonth}`;
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(student.name)}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
  };

  const handleSendPaymentRequest = (student, bill) => {
    const upiUrl = generateUPIUrl(bill.totalAmount, student);
    const message = `Dear ${student.name},\n\nYour tuition fee invoice for ${selectedMonth}:\nTotal Amount: ₹${bill.totalAmount}\n\nPay here: ${upiUrl}\n\nThank you!`;
    
    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/+91${student.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    // window.location.href = whatsappUrl;
  };

  const handleMarkAsPaid = async (studentId) => {
    if (window.confirm('Mark this payment as paid?')) {
      try {
        // Call your API to update payment status
        // await axios.patch(`/api/admin/payments/${studentId}`, {
        //   status: 'paid',
        //   month: selectedMonth
        // }, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        
        // Update local state
        setStudents(students.map(student => 
          student._id === studentId 
            ? { ...student, paymentStatus: 'paid' }
            : student
        ));
        
        alert('Payment marked as paid successfully!');
      } catch (error) {
        console.error('Error updating payment:', error);
        alert('Failed to update payment status');
      }
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Student Payments</h2>
          <p className="text-gray-600 mt-1">Manage student invoices and payment collection</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2024-04">April 2024</option>
            <option value="2024-05">May 2024</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Generate All Invoices
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Total Receivable</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            ₹{students.reduce((sum, student) => sum + calculateStudentBill(student).totalAmount, 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Pending Payments</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {students.filter(s => s.paymentStatus !== 'paid').length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Total Students</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {students.length}
          </div>
        </div>
      </div>

      {/* Student Payments Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
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
                const bill = calculateStudentBill(student);
                const paymentStatus = student.paymentStatus || 'pending';
                
                return (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.grade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{student.phone || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{student.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">₹{bill.totalAmount.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">{bill.totalHours} hours • {bill.totalSessions} sessions</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : paymentStatus === 'partial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {paymentStatus === 'paid' ? 'Paid' : 
                         paymentStatus === 'partial' ? 'Partial' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendPaymentRequest(student, bill)}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Send Invoice
                        </button>
                        <button
                          onClick={() => handleMarkAsPaid(student._id)}
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => {
                            // View invoice details
                            const details = bill.subjectBreakdown.map(item => 
                              `${item.subject}: ${item.hours}hrs @ ₹${item.rate}/hr = ₹${item.total}`
                            ).join('\n');
                            alert(`Invoice for ${student.name}\n\n${details}\n\nTotal: ₹${bill.totalAmount}`);
                          }}
                          className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* No data message */}
      {students.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No student data available</h3>
          <p className="text-gray-600">Student payment data will appear here once available.</p>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;