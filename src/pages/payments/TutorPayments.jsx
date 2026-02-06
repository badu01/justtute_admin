import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingPage from '../../components/LoadingPage';

const TutorPayments = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTutors();
  }, []);

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
      setTutors(response.data.teachers || []);
    } catch (err) {
      setError("Failed to fetch tutors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTutorEarnings = (tutor) => {
    // Mock calculation - replace with actual session data from your API
    const mockSessions = [
      { student: 'Rahul Verma', hours: 12, rate: tutor.hourlyRate || 500, total: 6000 },
      { student: 'Priya Sharma', hours: 8, rate: tutor.hourlyRate || 500, total: 4000 },
      { student: 'Amit Patel', hours: 10, rate: tutor.hourlyRate || 500, total: 5000 },
    ];
    
    const totalAmount = mockSessions.reduce((sum, session) => sum + session.total, 0);
    const totalHours = mockSessions.reduce((sum, session) => sum + session.hours, 0);
    
    return {
      totalAmount,
      totalHours,
      totalSessions: mockSessions.length,
      breakdown: mockSessions
    };
  };

  const handlePayTutor = async (tutorId, amount) => {
    if (window.confirm(`Process payment of ₹${amount.toLocaleString('en-IN')} to this tutor?`)) {
      try {
        // Call your API to process payment
        // await axios.post(`/api/admin/payments/tutor/${tutorId}`, {
        //   amount,
        //   month: selectedMonth
        // }, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        
        alert(`Payment of ₹${amount} processed successfully!`);
        
        // In a real app, you would update the tutor's payment status
        // setTutors(tutors.map(tutor => 
        //   tutor._id === tutorId 
        //     ? { ...tutor, lastPaymentDate: new Date().toISOString().split('T')[0] }
        //     : tutor
        // ));
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Failed to process payment');
      }
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const totalPayable = tutors.reduce((sum, tutor) => sum + calculateTutorEarnings(tutor).totalAmount, 0);
  const pendingPayouts = tutors.filter(t => calculateTutorEarnings(t).totalAmount > 0).length;
  const activeTutors = tutors.filter(t => calculateTutorEarnings(t).totalSessions > 0).length;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Tutor Payments</h2>
          <p className="text-gray-600 mt-1">Manage tutor salaries and payments</p>
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Process All Payments
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Total Payable</div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            ₹{totalPayable.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Pending Payouts</div>
          <div className="text-2xl font-bold text-yellow-600 mt-2">
            {pendingPayouts}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-500">Active Tutors</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {activeTutors}
          </div>
        </div>
      </div>

      {/* Tutor Payments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => {
          const earnings = calculateTutorEarnings(tutor);
          const hourlyRate = tutor.hourlyRate || 500;
          
          return (
            <div key={tutor._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{tutor.name}</h3>
                  <p className="text-sm text-gray-600">{tutor.email || 'No email'}</p>
                  <p className="text-xs text-gray-500 mt-1">Rate: ₹{hourlyRate}/hr</p>
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
                  <span className="font-medium">₹{hourlyRate}</span>
                </div>
              </div>

              {earnings.breakdown.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Students:</p>
                  <div className="space-y-2">
                    {earnings.breakdown.map((session, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate">{session.student}</span>
                        <span className="font-medium">₹{session.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePayTutor(tutor._id, earnings.totalAmount)}
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
                    const details = earnings.breakdown.map(item => 
                      `${item.student}: ${item.hours}hrs @ ₹${item.rate}/hr = ₹${item.total}`
                    ).join('\n');
                    alert(`Payment Details for ${tutor.name}\n\n${details}\n\nTotal: ₹${earnings.totalAmount}`);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No data message */}
      {tutors.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutor data available</h3>
          <p className="text-gray-600">Tutor payment data will appear here once available.</p>
        </div>
      )}
    </div>
  );
};

export default TutorPayments;