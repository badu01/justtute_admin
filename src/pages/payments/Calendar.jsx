import React from 'react';

const Calendar = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Class Calendar</h2>
        <p className="text-gray-600 mt-1">Schedule and manage teaching sessions</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar Feature Coming Soon</h3>
        <p className="text-gray-600">The class calendar feature will be available in the next update.</p>
        <p className="text-sm text-gray-500 mt-2">This will allow you to schedule and track all teaching sessions.</p>
      </div>
    </div>
  );
};

export default Calendar;