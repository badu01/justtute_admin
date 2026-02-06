import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true) // true for login, false for signup
    
    // Login State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    // Signup State
    const [signupEmail, setSignupEmail] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // -------------------- Validation --------------------
    const validateLoginForm = () => {
        if (!email || !password) {
            setError('All fields are required')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Invalid email format')
            return false
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }

        return true
    }

    const validateSignupForm = () => {
        if (!name || !signupEmail || !signupPassword || !confirmPassword) {
            setError('All fields are required')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(signupEmail)) {
            setError('Invalid email format')
            return false
        }

        if (signupPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }

        if (signupPassword !== confirmPassword) {
            setError('Passwords do not match')
            return false
        }

        return true
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!validateLoginForm()) return

        try {
            setLoading(true)
            const response = await axios.post(
                'https://justute.onrender.com/api/admin/login',
                {
                    email: email,
                    password: password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            const data = response.data
            console.log(data.token);

            // Store Token
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            // Redirect
            navigate('/')

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!validateSignupForm()) return

        try {
            setLoading(true)
            const response = await axios.post(
                'https://justute.onrender.com/api/admin/signup',
                {
                    // name: name,
                    email: signupEmail,
                    password: signupPassword
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            setSuccess('Account created successfully! Please login.')
            
            // Clear form and switch to login
            setName('')
            setSignupEmail('')
            setSignupPassword('')
            setConfirmPassword('')
            setIsLogin(true)

        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-screen flex flex-row'>

            {/* Left Section – Image / Branding */}
            <div className='hidden md:flex text-white w-full flex-[1.5] h-full 
                            bg-linear-to-t from-[#0F1281] to-[#4044CC] 
                            items-center justify-center bg-[url("/images/6013781.jpg")] bg-cover bg-center'>
                {/* <div className='text-center px-10'>
                    <img
                        src="https://illustrations.popsy.co/white/online-security.svg"
                        alt="Login Illustration"
                        className='w-96 mx-auto mb-6'
                    />
                    <h1 className='text-3xl font-bold mb-2'>Welcome Back!</h1>
                    <p className='text-lg opacity-90'>
                        Securely access your dashboard and manage everything in one place.
                    </p>
                </div> */}
            </div>

            {/* Right Section – Form */}
            <div className='w-full flex-1 h-full flex items-center justify-center'>
                <div className='w-full max-w-md px-8'>

                    {/* Toggle Header */}
                    <div className='flex mb-6 border-b border-gray-200'>
                        <button
                            onClick={() => {
                                setIsLogin(true)
                                setError('')
                                setSuccess('')
                            }}
                            className={`flex-1 py-3 text-center font-medium transition-colors ${isLogin 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false)
                                setError('')
                                setSuccess('')
                            }}
                            className={`flex-1 py-3 text-center font-medium transition-colors ${!isLogin 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Title */}
                    <h2 className='text-2xl font-bold mb-2 text-gray-800'>
                        {isLogin ? 'Login to your account' : 'Create new account'}
                    </h2>
                    <p className='text-gray-500 mb-6'>
                        {isLogin ? 'Enter your credentials to continue' : 'Fill in the details to get started'}
                    </p>

                    {/* Messages */}
                    {error && (
                        <div className='mb-4 text-red-600 text-sm bg-red-100 p-3 rounded'>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className='mb-4 text-green-600 text-sm bg-green-100 p-3 rounded'>
                            {success}
                        </div>
                    )}

                    {/* Login Form */}
                    {isLogin ? (
                        <form className='space-y-4' onSubmit={handleLogin}>
                            {/* Email */}
                            <div>
                                <label className='block text-sm font-medium text-gray-600 mb-1'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    placeholder='example@email.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg 
                                               focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className='block text-sm font-medium text-gray-600 mb-1'>
                                    Password
                                </label>
                                <input
                                    type='password'
                                    placeholder='••••••••'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg 
                                               focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>

                            {/* Remember & Forgot */}
                            <div className='flex items-center justify-between text-sm'>
                                <label className='flex items-center gap-2 text-gray-600'>
                                    <input type='checkbox' className='accent-indigo-600' />
                                    Remember me
                                </label>
                                <a href="#" className='text-indigo-600 hover:underline'>
                                    Forgot password?
                                </a>
                            </div>

                            {/* Button */}
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-indigo-600 text-white py-2 rounded-lg 
                                           hover:bg-indigo-700 transition duration-200 disabled:opacity-50'
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        /* Signup Form */
                        <form className='space-y-4' onSubmit={handleSignup}>
                            {/* Name */}
                            <div>
                                <label className='block text-sm font-medium text-gray-600 mb-1'>
                                    Full Name
                                </label>
                                <input
                                    type='text'
                                    placeholder='John Doe'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg 
                                               focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className='block text-sm font-medium text-gray-600 mb-1'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    placeholder='example@email.com'
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg 
                                               focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className='block text-sm font-medium text-gray-600 mb-1'>
                                    Password
                                </label>
                                <input
                                    type='password'
                                    placeholder='••••••••'
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg 
                                               focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className='block text-sm font-medium text-gray-600 mb-1'>
                                    Confirm Password
                                </label>
                                <input
                                    type='password'
                                    placeholder='••••••••'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='w-full px-4 py-2 border rounded-lg 
                                               focus:outline-none focus:ring-2 focus:ring-indigo-500'
                                />
                            </div>

                            {/* Terms Agreement */}
                            <div className='flex items-center text-sm'>
                                <input 
                                    type='checkbox' 
                                    id='terms' 
                                    className='accent-indigo-600 mr-2' 
                                    required
                                />
                                <label htmlFor='terms' className='text-gray-600'>
                                    I agree to the{' '}
                                    <a href="#" className='text-indigo-600 hover:underline'>
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className='text-indigo-600 hover:underline'>
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            {/* Button */}
                            <button
                                type='submit'
                                disabled={loading}
                                className='w-full bg-indigo-600 text-white py-2 rounded-lg 
                                           hover:bg-indigo-700 transition duration-200 disabled:opacity-50'
                            >
                                {loading ? 'Creating account...' : 'Sign Up'}
                            </button>
                        </form>
                    )}

                    {/* Toggle Link */}
                    <p className='text-center text-sm text-gray-600 mt-6'>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                                setSuccess('')
                            }}
                            className='text-indigo-600 hover:underline focus:outline-none'
                        >
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login