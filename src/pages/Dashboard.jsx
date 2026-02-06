import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingPage from '../components/LoadingPage';
import StatCard from '../components/StatCard';
import StatusCard from '../components/StatusCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    fullyAssigned: 0,
    partiallyAssigned: 0,
    unassigned: 0,
    totalTutors: 0,
    availableSubjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch students
      const studentsResponse = await axios.get(
        "https://justute.onrender.com/api/admin/students",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Fetch tutors
      const tutorsResponse = await axios.get(
        "https://justute.onrender.com/api/admin/teachers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const students = studentsResponse.data.students;
      const tutors = tutorsResponse.data.teachers;

      // Transform students data to get assignment stats
      let fullyAssigned = 0;
      let partiallyAssigned = 0;
      let unassigned = 0;

      students.forEach(student => {
        const assignedTeachers = student.teachers.filter(t => t.teacher);
        const assignedSubjects = assignedTeachers.length;
        const totalSubjects = student.subjects.length;

        if (assignedSubjects === 0) unassigned++;
        else if (assignedSubjects === totalSubjects) fullyAssigned++;
        else partiallyAssigned++;
      });

      // Get unique subjects from tutors
      const allSubjects = tutors.flatMap(tutor => tutor.subjects);
      const uniqueSubjects = [...new Set(allSubjects)];

      setStats({
        total: students.length,
        fullyAssigned,
        partiallyAssigned,
        unassigned,
        totalTutors: tutors.length,
        availableSubjects: uniqueSubjects.length
      });

    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h2>
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

      {/* Status Cards */}
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
    </div>
  );
};

export default Dashboard;