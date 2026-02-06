import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineDashboard,MdOutlinePayment } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { PiStudent,PiChalkboardTeacher } from "react-icons/pi";
import { IoCashOutline } from "react-icons/io5";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation structure
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (<MdOutlineDashboard className="w-5 h-5" />),
      path: '/admin/dashboard'
    },
    {
      id: 'students',
      label: 'Student Management',
      icon: (<PiStudent className="w-5 h-5" />),
      path: '/admin/students'
    },
    {
      id: 'tutors',
      label: 'Tutor Management',
      icon: (<PiChalkboardTeacher className="w-5 h-5" />),
      path: '/admin/tutors'
    },
    {
      id: 'payments',
      label: 'Payment Management',
      icon: (
        <MdOutlinePayment className="w-5 h-5" />
      ),
      subItems: [
        { id: 'student-payments', label: 'Student Payments', path: '/admin/payments/students' },
        { id: 'tutor-payments', label: 'Tutor Payments', path: '/admin/payments/tutors' },
        { id: 'calendar', label: 'Calendar', path: '/admin/payments/calendar' }
      ]
    },
    {
      id: 'revenue',
      label: 'Revenue Analytics',
      icon: (<IoCashOutline className="w-5 h-5" />),
      path: '/admin/revenue'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <TbReportAnalytics className="w-5 h-5" />
      ),
      path: '/admin/reports'
    }
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
      setActiveMenu(item.id);
      setActiveSubMenu('');
    }
  };

  const handleSubNavigation = (parentId, subItem) => {
    navigate(subItem.path);
    setActiveMenu(parentId);
    setActiveSubMenu(subItem.id);
  };

  return (
    <div className="min-h-screen bg-blue-200/20">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
        <div className="flex items-center h-full px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            {/* <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JT</span>
              </div>
              <span className={`ml-3 font-semibold text-gray-900 ${sidebarCollapsed ? 'hidden' : 'hidden md:inline'}`}>
                JustTute Admin
              </span>
            </div>
          </div>
          {/* Page Title */}
          <div className="ml-6 flex-1">
            <h1 className="text-lg font-medium text-gray-900">
              {navigationItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
            </h1>
          </div>
          {/* Right side: Notifications and User */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-3 focus:outline-none">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-700 font-medium text-sm">AD</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 z-20">
        <div className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => item.subItems ? setActiveMenu(activeMenu === item.id ? '' : item.id) : handleNavigation(item)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm  transition-colors ${
                    activeMenu === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-700/20 border-x-0'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`${item.subItems && activeMenu === item.id ? 'text-blue-600' : ''}`}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      {item.subItems && (
                        <svg className={`w-4 h-4 transition-transform ${
                          activeMenu === item.id ? 'rotate-180' : ''
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </>
                  )}
                </button>
                {/* Submenu Items */}
                {item.subItems && activeMenu === item.id && !sidebarCollapsed && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubNavigation(item.id, subItem)}
                        className={`w-full flex items-center px-3 py-2 text-sm transition-colors ${
                          activeSubMenu === subItem.id
                            ? 'bg-green-100 text-green-700 border border-green-700/20 border-x-0'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="ml-1">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          {/* Bottom Section - Only visible when sidebar is expanded */}
          {!sidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="space-y-4">
                {/* Help Section */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-900">Need help?</h4>
                      <p className="text-xs text-blue-700 mt-1">Check our documentation</p>
                    </div>
                  </div>
                </div>
                {/* Logout Button */}
                <button
                  onClick={() => {
                    // Handle logout
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {!sidebarCollapsed && (
                    <span className="ml-3">Logout</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="">
          {/* Breadcrumb */}
          <div className="ml-3 my-1.5">
            <nav className="flex text-sm">
              <a href="/admin" className="text-gray-500 hover:text-gray-700">Admin</a>
              {activeMenu && (
                <>
                  <span className="mx-2 text-gray-400">/</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    {navigationItems.find(item => item.id === activeMenu)?.label}
                  </a>
                </>
              )}
              {activeSubMenu && (
                <>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-green-700">
                    {navigationItems
                      .find(item => item.id === activeMenu)
                      ?.subItems?.find(sub => sub.id === activeSubMenu)?.label}
                  </span>
                </>
              )}
            </nav>
          </div>
          {/* Page Content */}
          <div className="bg-white border border-gray-200 border-l-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;