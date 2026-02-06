import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  payments,
  monthlyReports
} from '../data/dummyData';

const RevenueManagement = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Process data for charts
  const getMonthlyData = () => {
    return monthlyReports.map(report => ({
      month: report.month.split(' ')[0],
      revenue: report.totalRevenue,
      expenses: report.totalExpenses,
      profit: report.netProfit,
      students: report.studentPayments,
      tutors: report.tutorPayments
    }));
  };

  const getPaymentBreakdown = () => {
    const studentPayments = payments.filter(p => p.type === 'student_to_admin');
    const tutorPayments = payments.filter(p => p.type === 'admin_to_tutor');
    
    const studentTotal = studentPayments.reduce((sum, p) => sum + p.amount, 0);
    const tutorTotal = tutorPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return [
      { name: 'Student Payments', value: studentTotal },
      { name: 'Tutor Payments', value: tutorTotal }
    ];
  };

  const getRecentTransactions = () => {
    return [...payments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const calculateStats = () => {
    const currentMonth = monthlyReports[0];
    const previousMonth = monthlyReports[1];
    
    return {
      totalRevenue: currentMonth.totalRevenue,
      revenueGrowth: ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue * 100).toFixed(1),
      totalProfit: currentMonth.netProfit,
      profitGrowth: ((currentMonth.netProfit - previousMonth.netProfit) / previousMonth.netProfit * 100).toFixed(1),
      activeStudents: 45, // This would come from actual data
      newStudents: currentMonth.newStudents,
      totalClasses: currentMonth.totalClasses
    };
  };

  const stats = calculateStats();
  const monthlyData = getMonthlyData();
  const paymentBreakdown = getPaymentBreakdown();
  const recentTransactions = getRecentTransactions();
  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Revenue Management</h2>
            <p className="text-purple-100">Financial analytics and transaction history</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-purple-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white border border-purple-300 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <button className="px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium">
              Export Statements
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900 mt-2">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </p>
                <p className={`text-sm mt-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.revenueGrowth >= 0 ? '↗' : '↘'} {stats.revenueGrowth}% from last month
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Net Profit</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">
                  ₹{stats.totalProfit.toLocaleString('en-IN')}
                </p>
                <p className={`text-sm mt-1 ${stats.profitGrowth >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {stats.profitGrowth >= 0 ? '↗' : '↘'} {stats.profitGrowth}% from last month
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">Active Students</p>
                <p className="text-2xl font-bold text-purple-900 mt-2">{stats.activeStudents}</p>
                <p className="text-sm text-purple-600 mt-1">
                  +{stats.newStudents} new this month
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.966.65-1.931 1-3 1s-2.034-.35-3-1m-6 0c-.966.65-1.931 1-3 1s-2.034-.35-3-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-800">Total Classes</p>
                <p className="text-2xl font-bold text-pink-900 mt-2">{stats.totalClasses}</p>
                <p className="text-sm text-pink-600 mt-1">
                  Average: {Math.round(stats.totalClasses / 30)} per day
                </p>
              </div>
              <div className="bg-pink-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    name="Expenses" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Breakdown Chart */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Transactions →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-white">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.type === 'student_to_admin' 
                          ? `From: ${transaction.studentName}`
                          : `To: ${transaction.tutorName}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'student_to_admin'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type === 'student_to_admin' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        transaction.type === 'student_to_admin'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'student_to_admin' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;