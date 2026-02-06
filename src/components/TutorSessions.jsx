import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TutorSessions = ({ tutorId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter state
  const [paymentFilter, setPaymentFilter] = useState('ALL'); // ALL, PAID, UNPAID
  const [dateFilter, setDateFilter] = useState('ALL'); // ALL, TODAY, THIS_WEEK, THIS_MONTH
  const [subjectFilter, setSubjectFilter] = useState('ALL'); // ALL or specific subject

  useEffect(() => {
    fetchSessions();
  }, [tutorId, currentPage, paymentFilter, dateFilter, subjectFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
      });
      
      if (paymentFilter !== 'ALL') {
        params.append('status', paymentFilter);
      }
      
      // Add date filter logic (you'll need to implement date range logic on backend)
      if (dateFilter !== 'ALL') {
        // For demo, we'll just pass the filter
        params.append('dateRange', dateFilter);
      }
      
      if (subjectFilter !== 'ALL') {
        params.append('subject', subjectFilter);
      }
      
      const response = await axios.get(
        `https://justute.onrender.com/api/admin/view-sessions/teacher/${tutorId}?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data =response.data;
      
      if (data.status === 'success') {
        setSessions(data.sessions || []);
        setCurrentPage(data.currentPage || 1);
        setTotalPages(data.totalPages || 1);
        setTotalSessions(data.totalActions || 0);
      } else {
        setError(data.message || 'Failed to fetch sessions');
        // Set mock data for demo
        setMockData();
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions. Please try again.');
      // Set mock data for demo
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    // Mock data for demonstration
    const mockSessions = [
      {
        _id: '1',
        teacher: { _id: tutorId, name: 'Dr. Sharma' },
        student: { _id: '1', name: 'Rahul Verma', grade: '10th' },
        subject: 'Mathematics',
        topic: 'Algebra: Quadratic Equations',
        startTime: '2024-01-15T10:30:00.000Z',
        endTime: '2024-01-15T12:30:00.000Z',
        paymentStatus: 'PAID',
        duration: 2
      },
      {
        _id: '2',
        teacher: { _id: tutorId, name: 'Dr. Sharma' },
        student: { _id: '2', name: 'Priya Sharma', grade: '11th' },
        subject: 'Physics',
        topic: 'Newton\'s Laws of Motion',
        startTime: '2024-01-16T14:00:00.000Z',
        endTime: '2024-01-16T15:30:00.000Z',
        paymentStatus: 'PAID',
        duration: 1.5
      },
      {
        _id: '3',
        teacher: { _id: tutorId, name: 'Dr. Sharma' },
        student: { _id: '3', name: 'Amit Patel', grade: '12th' },
        subject: 'Mathematics',
        topic: 'Calculus: Differentiation',
        startTime: '2024-01-17T11:00:00.000Z',
        endTime: '2024-01-17T13:00:00.000Z',
        paymentStatus: 'UNPAID',
        duration: 2
      },
      {
        _id: '4',
        teacher: { _id: tutorId, name: 'Dr. Sharma' },
        student: { _id: '1', name: 'Rahul Verma', grade: '10th' },
        subject: 'Mathematics',
        topic: 'Trigonometry',
        startTime: '2024-01-18T10:30:00.000Z',
        endTime: '2024-01-18T12:00:00.000Z',
        paymentStatus: 'UNPAID',
        duration: 1.5
      },
      {
        _id: '5',
        teacher: { _id: tutorId, name: 'Dr. Sharma' },
        student: { _id: '2', name: 'Priya Sharma', grade: '11th' },
        subject: 'Physics',
        topic: 'Work, Energy, and Power',
        startTime: '2024-01-19T14:00:00.000Z',
        endTime: '2024-01-19T15:00:00.000Z',
        paymentStatus: 'PAID',
        duration: 1
      }
    ];
    
    setSessions(mockSessions);
    setCurrentPage(1);
    setTotalPages(2);
    setTotalSessions(12);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  const calculateAmount = (session) => {
    // In real app, you'd fetch tutor's rate from the tutor object
    const ratePerHour = 500; // Default rate
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    return Math.round(hours * ratePerHour);
  };

  const getUniqueSubjects = () => {
    const subjects = sessions.map(session => session.subject);
    return ['ALL', ...new Set(subjects)];
  };

  const handleMarkAsPaid = async (sessionId) => {
    if (window.confirm('Mark this session as paid?')) {
      try {
        // Call your API to update payment status
        // await fetch(`/api/admin/update-session-payment/${sessionId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ paymentStatus: 'PAID' })
        // });
        
        // Update local state
        setSessions(sessions.map(session => 
          session._id === sessionId 
            ? { ...session, paymentStatus: 'PAID' }
            : session
        ));
        
        alert('Session marked as paid successfully!');
      } catch (error) {
        console.error('Error updating payment status:', error);
        alert('Failed to update payment status');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header with Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Teaching Sessions</h2>
            <p className="text-gray-600 mt-1">Track and manage all teaching sessions</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Sessions</div>
            <div className="text-3xl font-bold text-gray-900">{totalSessions}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid Only</option>
              <option value="UNPAID">Unpaid Only</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
            </select>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Subjects</option>
              {getUniqueSubjects()
                .filter(subject => subject !== 'ALL')
                .map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
            </select>

            <button
              onClick={() => {
                setPaymentFilter('ALL');
                setDateFilter('ALL');
                setSubjectFilter('ALL');
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300"
            >
              Clear Filters
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
              <option value="20">20 per page</option>
            </select>
          </div>
        </div>

        {/* Active filters display */}
        {(paymentFilter !== 'ALL' || dateFilter !== 'ALL' || subjectFilter !== 'ALL') && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {paymentFilter !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Payment: {paymentFilter}
                <button
                  onClick={() => setPaymentFilter('ALL')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {dateFilter !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Date: {dateFilter.replace('_', ' ')}
                <button
                  onClick={() => setDateFilter('ALL')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {subjectFilter !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Subject: {subjectFilter}
                <button
                  onClick={() => setSubjectFilter('ALL')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sessions List */}
      <div className="overflow-x-auto">
        {sessions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600">No teaching sessions match your current filters.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject & Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {sessions.map((session) => (
                <tr key={session._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(session.startTime)}</div>
                    <div className="text-sm text-gray-600">
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {session.student.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {session.student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {session.student.grade || 'Grade not specified'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{session.subject}</div>
                    <div className="text-sm text-gray-600 truncate max-w-xs">{session.topic}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {calculateDuration(session.startTime, session.endTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{calculateAmount(session)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      session.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {session.paymentStatus === 'PAID' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.alert(`View details for session: ${session.topic}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {session.paymentStatus === 'UNPAID' && (
                        <button
                          onClick={() => handleMarkAsPaid(session._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => window.alert(`Edit session: ${session.topic}`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalSessions)}
              </span>{' '}
              of <span className="font-medium">{totalSessions}</span> sessions
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-1">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Hours</div>
            <div className="text-2xl font-bold text-gray-900">
              {sessions.reduce((total, session) => {
                const hours = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60 * 60);
                return total + hours;
              }, 0).toFixed(1)}h
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Earnings</div>
            <div className="text-2xl font-bold text-green-600">
              ₹{sessions.reduce((total, session) => total + calculateAmount(session), 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Pending Payment</div>
            <div className="text-2xl font-bold text-red-600">
              ₹{sessions
                .filter(s => s.paymentStatus === 'UNPAID')
                .reduce((total, session) => total + calculateAmount(session), 0)
                .toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorSessions;