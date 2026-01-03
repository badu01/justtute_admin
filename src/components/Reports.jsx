import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Reports = ({ monthlyReports, students, tutors, classSessions, payments }) => {
  const [selectedMonth, setSelectedMonth] = useState(monthlyReports[0].month);
  const [reportType, setReportType] = useState('financial');

  const currentReport = monthlyReports.find(report => report.month === selectedMonth) || monthlyReports[0];

  const generateFinancialReport = () => {
    const financialData = monthlyReports.map(report => ({
      month: report.month,
      income: report.studentPayments,
      expenses: report.tutorPayments,
      profit: report.netProfit,
      margin: ((report.netProfit / report.studentPayments) * 100).toFixed(1)
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Revenue</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              ₹{currentReport.totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Expenses</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              ₹{currentReport.totalExpenses.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Net Profit</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              ₹{currentReport.netProfit.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-500">Profit Margin</div>
            <div className="text-2xl font-bold text-gray-900 mt-2">
              {((currentReport.netProfit / currentReport.totalRevenue) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Financial Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#10B981" />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
                <Bar dataKey="profit" name="Profit" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const generatePerformanceReport = () => {
    const tutorPerformance = tutors.map(tutor => {
      const tutorSessions = classSessions.filter(
        session => session.tutorId === tutor.id &&
        session.date.startsWith(selectedMonth.slice(0, 7))
      );
      
      const totalHours = tutorSessions.reduce((sum, session) => sum + session.duration, 0);
      const totalEarnings = tutorSessions.reduce((sum, session) => sum + session.amount, 0);
      const studentCount = new Set(tutorSessions.map(s => s.studentId)).size;
      
      return {
        name: tutor.name,
        sessions: tutorSessions.length,
        hours: totalHours,
        earnings: totalEarnings,
        students: studentCount,
        efficiency: totalHours > 0 ? (totalEarnings / totalHours).toFixed(0) : 0
      };
    });

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Tutor Performance</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tutorPerformance.map((tutor, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{tutor.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{tutor.sessions}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{tutor.hours}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">₹{tutor.earnings.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{tutor.students}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-blue-600">₹{tutor.efficiency}/hr</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const generateStudentReport = () => {
    const studentData = students.map(student => {
      const studentSessions = classSessions.filter(
        session => session.studentId === student.id &&
        session.date.startsWith(selectedMonth.slice(0, 7))
      );
      
      const totalHours = studentSessions.reduce((sum, session) => sum + session.duration, 0);
      const totalAmount = studentSessions.reduce((sum, session) => sum + session.amount, 0);
      const subjectsCount = new Set(studentSessions.map(s => s.subject)).size;
      
      return {
        name: student.name,
        grade: student.grade,
        sessions: studentSessions.length,
        hours: totalHours,
        amount: totalAmount,
        subjects: subjectsCount,
        paymentStatus: student.paymentStatus
      };
    });

    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Student Activity Report</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {studentData.map((student, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{student.sessions}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{student.hours}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">₹{student.amount.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{student.subjects}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleExportPDF = () => {
    const reportContent = `
      Monthly Report - ${selectedMonth}
      ================================
      
      Financial Summary:
      - Total Revenue: ₹${currentReport.totalRevenue.toLocaleString('en-IN')}
      - Total Expenses: ₹${currentReport.totalExpenses.toLocaleString('en-IN')}
      - Net Profit: ₹${currentReport.netProfit.toLocaleString('en-IN')}
      - Profit Margin: ${((currentReport.netProfit / currentReport.totalRevenue) * 100).toFixed(1)}%
      
      Operational Metrics:
      - Total Classes: ${currentReport.totalClasses}
      - New Students: ${currentReport.newStudents}
      - New Tutors: ${currentReport.newTutors}
      - Average Rating: ${currentReport.averageRating}/5
      
      Payment Summary:
      - Student Payments: ₹${currentReport.studentPayments.toLocaleString('en-IN')}
      - Tutor Payments: ₹${currentReport.tutorPayments.toLocaleString('en-IN')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Report_${selectedMonth.replace(' ', '_')}.txt`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
            <p className="text-indigo-100">Comprehensive system reports and insights</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {monthlyReports.map(report => (
                <option key={report.month} value={report.month}>
                  {report.month}
                </option>
              ))}
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="financial">Financial Report</option>
              <option value="performance">Performance Report</option>
              <option value="student">Student Report</option>
              <option value="comprehensive">Comprehensive Report</option>
            </select>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{selectedMonth} Report</h3>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Overall Status</div>
            <div className={`text-xl font-bold ${
              currentReport.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentReport.netProfit >= 0 ? 'Profitable' : 'Loss Making'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-800">Student Growth</div>
            <div className="text-2xl font-bold text-blue-900 mt-2">
              +{currentReport.newStudents}
            </div>
            <div className="text-xs text-blue-600 mt-1">new students</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm font-medium text-green-800">Class Volume</div>
            <div className="text-2xl font-bold text-green-900 mt-2">
              {currentReport.totalClasses}
            </div>
            <div className="text-xs text-green-600 mt-1">classes conducted</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-800">Quality Score</div>
            <div className="text-2xl font-bold text-purple-900 mt-2">
              {currentReport.averageRating}/5
            </div>
            <div className="text-xs text-purple-600 mt-1">average rating</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm font-medium text-yellow-800">Tutor Growth</div>
            <div className="text-2xl font-bold text-yellow-900 mt-2">
              +{currentReport.newTutors}
            </div>
            <div className="text-xs text-yellow-600 mt-1">new tutors</div>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {reportType === 'financial' && generateFinancialReport()}
          {reportType === 'performance' && generatePerformanceReport()}
          {reportType === 'student' && generateStudentReport()}
          {reportType === 'comprehensive' && (
            <div className="space-y-6">
              {generateFinancialReport()}
              {generatePerformanceReport()}
              {generateStudentReport()}
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-linear-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Revenue Growth</div>
                  <div className="text-sm text-gray-600">
                    Revenue increased by {((currentReport.totalRevenue - monthlyReports[1].totalRevenue) / monthlyReports[1].totalRevenue * 100).toFixed(1)}% from previous month
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Quality Maintenance</div>
                  <div className="text-sm text-gray-600">
                    Average rating maintained at {currentReport.averageRating} despite {currentReport.newStudents} new students
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;