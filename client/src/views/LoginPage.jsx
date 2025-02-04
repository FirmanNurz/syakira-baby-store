import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const {data} = await axios.post('https://syakira-baby-store.firmanz.tech/user/login', {
                email,
                password
            });

            localStorage.setItem('accessToken', data.accessToken);
            window.dispatchEvent(new Event('authStateChanged'));
            navigate('/');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    async function googleLogin(codeResponse) {
        console.log('Google login response:', codeResponse);
        
        try {
            const {data} = await axios.post('https://syakira-baby-store.firmanz.tech/user/google-login', { token: codeResponse.credential}, {
                headers: { token: codeResponse.credential },
            });

            localStorage.setItem('accessToken', data.accessToken);
            window.dispatchEvent(new Event('authStateChanged'));
            navigate('/');
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Decorative */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-pink-400 to-purple-500">
                <div className="w-full flex items-center justify-center p-12">
                    <div className="max-w-md text-white">
                        <h1 className="text-4xl font-bold mb-6">Welcome to Syakira Baby Store</h1>
                        <p className="text-lg opacity-90">Discover our adorable collection of baby clothes, designed for comfort and style.</p>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo and Title */}
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/register" className="font-medium text-pink-600 hover:text-pink-500">
                                create a new account
                            </Link>
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <div className="flex justify-center">
                        <GoogleLogin 
                            onSuccess={googleLogin}
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/forgot-password" className="text-pink-600 hover:text-pink-500">
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}