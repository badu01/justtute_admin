import React, { useState,useEffect } from 'react';
import TutorManagement from '../components/TutorManagement';
import axios from 'axios';
import LoadingPage from '../components/LoadingPage';

const TutorManagementPage = () => {
  const [tutors, setTutors] = useState([]);
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
      setTutors(response.data.teachers);
    } catch (err) {
      setError("Failed to fetch tutors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTutor = async (updatedTutor) => {
    try {
      const response = await axios.put(
        `https://justute.onrender.com/api/admin/update-teacher/${updatedTutor._id}`,
        {
          name: updatedTutor.name,
          email: updatedTutor.email,
          phone: updatedTutor.phone,
          qualification: updatedTutor.qualification,
          subjects: updatedTutor.subjects,
          address: updatedTutor.address
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setTutors(tutors.map(tutor => 
          tutor._id === updatedTutor._id ? response.data.teacher : tutor
        ));
        alert('Tutor updated successfully!');
      }
    } catch (error) {
      console.error('Error updating tutor:', error);
      alert('Failed to update tutor');
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="">
      <TutorManagement 
        tutors={tutors} 
        onUpdateTutor={handleUpdateTutor}
      />
    </div>
  );
};

export default TutorManagementPage;