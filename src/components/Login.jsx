import React, { use, useState } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

function Login() {

    // -------------------- State --------------------
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // -------------------- Validation --------------------
    const validateForm = () => {
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

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) return
        console.log(email,password);
        

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
            console.log(response);

           
            // if (!response.status !== 200) {
            //     throw new Error('Invalid credentials')
            // }

            const data = response.data
            console.log(data.token);
            


            // -------- Store Token --------
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            // -------- Redirect --------
            navigate('/')

        } catch (err) {
            setError(err.message || 'Login failed')
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

            {/* Right Section – Login Form */}
            <div className='w-full flex-1 h-full flex items-center justify-center'>
                <div className='w-full max-w-md px-8'>

                    <h2 className='text-2xl font-bold mb-2 text-gray-800'>
                        Login to your account
                    </h2>
                    <p className='text-gray-500 mb-6'>
                        Enter your credentials to continue
                    </p>
                    {error && (
                        <div className='mb-4 text-red-600 text-sm bg-red-100 p-2 rounded'>
                            {error}
                        </div>
                    )}

                    <form className='space-y-4' onSubmit={handleLogin}>

                        {/* Email */}
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1'>
                                Email
                            </label>
                            <input
                                type='email'
                                placeholder='example@email.com'
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
                                       hover:bg-indigo-700 transition duration-200'
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Signup */}
                    <p className='text-center text-sm text-gray-600 mt-6'>
                        Don’t have an account?{' '}
                        <a href="#" className='text-indigo-600 hover:underline'>
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
