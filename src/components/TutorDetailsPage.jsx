import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TutorSessions from './TutorSessions';

const TutorDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [allSubjects, setAllSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([
        'Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
        'Computer Science', 'Geography', 'History', 'Economics'
    ]);
    const [showSessions, setShowSessions] = useState(false);

    useEffect(() => {
        fetchTutorDetails();
    }, [id]);

    const fetchTutorDetails = async () => {
        try {
            setLoading(true);
            // Mock API call - replace with your actual API
            const response = await axios.get(
                `https://justute.onrender.com/api/admin/teacher/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            const data = await response.data;
            console.log(response);

            if (data.status === 'success') {
                setTutor(data.teacher);
                setFormData({
                    name: data.teacher.name,
                    email: data.teacher.email,
                    phone: data.teacher.phone,
                    qualification: data.teacher.qualification,
                    subjects: [...data.teacher.subjects],
                    address: data.teacher.address
                });
                setAllSubjects(data.teacher.subjects);
            }
        } catch (error) {
            console.error('Error fetching tutor details:', error);
            // Mock data for demo
            setTutor({
                _id: id,
                name: 'Teacher 2',
                email: 'teacher2@test.com',
                phone: '1041175343',
                address: '1234 Street Ave, City 2',
                qualification: 'M.Sc in Education 2',
                subjects: ['Computer Science', 'Chemistry', 'Geography'],
                amountEarned: 0,
                students: [
                    {
                        student: {
                            _id: '697cbc8985b4965ba94a4918',
                            name: 'Student 4',
                            grade: 'Grade 8'
                        },
                        subject: 'Math',
                        ratePerHour: 300,
                        _id: '697cbc8b85b4965ba94a4953'
                    }
                ],
                isProfileComplete: false,
                createdAt: '2026-01-30T14:13:24.992Z'
            });
            setFormData({
                name: 'Teacher 2',
                email: 'teacher2@test.com',
                phone: '1041175343',
                qualification: 'M.Sc in Education 2',
                subjects: ['Computer Science', 'Chemistry', 'Geography'],
                address: '1234 Street Ave, City 2'
            });
            setAllSubjects(['Computer Science', 'Chemistry', 'Geography']);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubjectToggle = (subject) => {
        const updatedSubjects = formData.subjects.includes(subject)
            ? formData.subjects.filter(s => s !== subject)
            : [...formData.subjects, subject];

        setFormData({
            ...formData,
            subjects: updatedSubjects
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {


            const response = await axios.patch(
                `https://justute.onrender.com/api/admin/update-teacher/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = response.data;

            if (data.status === 'success') {
                fetchTutorDetails();
                setIsEditing(false);
                alert('Tutor details updated successfully!');
            }
        } catch (error) {
            console.error('Error updating tutor:', error);
            alert('Failed to update tutor details');
        }
    };

    const calculateTotalEarnings = () => {
        if (!tutor?.students) return 0;
        return tutor.students.reduce((total, assignment) => {
            // In a real app, you'd calculate based on hours taught
            return total + assignment.ratePerHour;
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tutor details...</p>
                </div>
            </div>
        );
    }

    if (!tutor) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Tutor not found</h2>
                    <button
                        onClick={() => navigate('/admin/tutors')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Tutors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Minimal Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/tutors')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Tutor Profile</h1>
                                <p className="text-sm text-gray-600">Manage tutor information and assignments</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate('/admin/tutors')}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Back to List
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </button>
                            <button
                                onClick={() => setShowSessions(!showSessions)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                {showSessions ? 'Hide Sessions' : 'View Sessions'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Profile Header with Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-8">
                            <div className="flex items-start space-x-6">
                                {/* Avatar */}
                                <div className="shrink-0">
                                    <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">
                                            {tutor.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>

                                {/* Main Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h2>
                                            <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89-4.26a2 2 0 011.78 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {tutor.email}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {tutor.phone}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div>

                                            <div className="flex space-x-6">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-gray-900">
                                                        {tutor.students?.length || 0}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Students</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-green-600">
                                                        {tutor.subjects?.length || 0}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Subjects</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        ₹{calculateTotalEarnings().toLocaleString('en-IN')}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Earnings</div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                    {/* Qualification */}
                                    {tutor.qualification && (
                                        <div className="mt-4">
                                            <span className="text-sm font-medium text-gray-700">Qualification:</span>
                                            <span className="ml-2 text-gray-900">{tutor.qualification}</span>
                                        </div>
                                    )}

                                    {/* Subjects */}
                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {tutor.subjects.map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Joined Date */}

                                    <div className="">
                                        <div className="text-sm text-gray-600">Joined on</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {new Date(tutor.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {Math.floor((new Date() - new Date(tutor.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="">
                        {/* Left Column - Details */}
                        <div className=" space-y-8">
                            {/* Edit Form / Details View */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                        {isEditing ? 'Edit Profile Information' : 'Profile Details'}
                                    </h3>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Qualification
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="qualification"
                                                        value={formData.qualification}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Address
                                                    </label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        rows="2"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Subjects
                                                </label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Geography'].map((subject) => (
                                                        <div
                                                            key={subject}
                                                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.subjects.includes(subject)
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                            onClick={() => handleSubjectToggle(subject)}
                                                        >
                                                            <div className="flex items-center">
                                                                <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${formData.subjects.includes(subject)
                                                                    ? 'bg-blue-500 border-blue-500'
                                                                    : 'border-gray-300'
                                                                    }`}>
                                                                    {formData.subjects.includes(subject) && (
                                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <span className="text-sm">{subject}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-600">Email</div>
                                                    <div className="text-lg text-gray-900">{tutor.email}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-600">Phone</div>
                                                    <div className="text-lg text-gray-900">{tutor.phone}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-600">Qualification</div>
                                                    <div className="text-lg text-gray-900">{tutor.qualification || '—'}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-600">Profile Status</div>
                                                    <div className={`text-lg ${tutor.isProfileComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {tutor.isProfileComplete ? 'Complete' : 'Incomplete'}
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <div className="text-sm text-gray-600">Address</div>
                                                    <div className="text-lg text-gray-900">{tutor.address || '—'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Assigned Students */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-semibold text-gray-900">Assigned Students</h3>
                                        <span className="text-sm text-gray-600">{tutor.students?.length || 0} students</span>
                                    </div>

                                    {tutor.students && tutor.students.length > 0 ? (
                                        <div className="space-y-4">
                                            {tutor.students.map((assignment) => (
                                                <div key={assignment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-blue-600 font-semibold text-lg">
                                                                {assignment.student.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-medium text-gray-900">
                                                                {assignment.student.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">{assignment.student.grade}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-semibold text-gray-900">
                                                            {assignment.subject}
                                                        </div>
                                                        <div className="text-sm text-blue-600">₹{assignment.ratePerHour}/hour</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No students assigned yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        {showSessions && (
                            <div className="mt-8">
                                <TutorSessions tutorId={tutor._id} />
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TutorDetailsPage;