'use client';

import React, { Suspense, useContext, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { AuthContext } from '@/providers/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from 'axios';
import Link from 'next/link';

const MySwal = withReactContent(Swal);

// Main component that uses useSearchParams()
const AuthContent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { signIn, setUser, googleSignin } = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    googleSignin()
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const userData = {
          displayName,
          photoURL,
          email,
          role: "user",
        };

        axios.post('https://ecovision-backend-five.vercel.app/users', userData)
          .then((response) => {
            MySwal.fire({
              title: "Welcome Back! 👋",
              text: "Login successful",
              icon: "success",
              timer: 1000,
              timerProgressBar: true,
              showConfirmButton: false,
              background: "#f8fafc",
              iconColor: "#4f46e5",
            });
            
            setTimeout(() => {
              const returnUrl = searchParams.get('returnUrl') || '/';
              router.push(returnUrl);
            }, 500);
          })
          .catch((err) => {
            MySwal.fire({
              title: "Error!",
              text: err.message,
              icon: "error",
              background: "#f8fafc",
              confirmButtonColor: "#4f46e5",
            });
          });
      })
      .catch((err) => {
        MySwal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
          background: "#f8fafc",
          confirmButtonColor: "#4f46e5",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password)
      .then((res) => {
        setUser(res.user);
        MySwal.fire({
          title: "Welcome Back! 👋",
          text: "Login successful",
          icon: "success",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#f8fafc",
          iconColor: "#4f46e5",
        });
        setTimeout(() => {
          const returnUrl = searchParams.get('returnUrl') || '/';
          router.push(returnUrl);
          
        }, 800);
      })
      .catch((err) => {
        MySwal.fire({
          title: "Oops!",
          text: `${err.message}`,
          icon: "error",
          background: "#f8fafc",
          confirmButtonColor: "#4f46e5",
        });
      })
      .finally(() => setIsLoading(false));
  };

  // Function to auto-fill admin credentials
  const handleAdminCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('Aa123456!');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-blue-800 rounded-lg mr-3"></div>
            <h1 className="text-2xl font-bold text-gray-800">Ecovision Partners</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Create an Account'}
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8">
            {isLogin 
              ? 'Please enter your details' 
              : 'Enter your information to get started'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">Email address</label>
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                required 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                required 
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirm-password" className="block text-gray-700 mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  required 
                />
              </div>
            )}

            {isLogin && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="mr-2 rounded text-purple-600"
                  />
                  <label htmlFor="remember" className="text-gray-700">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password
                </a>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
            </button>

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center border rounded-lg py-3 hover:bg-gray-100 transition duration-300"
                disabled={isLoading}
              >
                <img 
                  src="https://www.vectorlogo.zone/logos/google/google-icon.svg" 
                  alt="Google" 
                  className="w-5 h-5 mr-2" 
                />
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </button>
            </div>

            {/* Admin Credentials Button */}
            {isLogin && (
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={handleAdminCredentials}
                  className="w-full flex items-center justify-center bg-gray-200 rounded-lg py-3 hover:bg-gray-300 transition duration-300"
                >
                  <span className="text-gray-700">Use Admin Credentials</span>
                </button>
              </div>
            )}

            <div className="text-center mt-4">
              {isLogin ? (
                <p>
                  Don't have an account? 
                  <Link href='/register'
                    type="button" 
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 ml-1 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account? 
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(true)}
                    className="text-purple-600 ml-1 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Illustration Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-800 to-blue-900 relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0">
          <img 
            src="https://media.istockphoto.com/id/907843354/photo/two-businesswomen-working-on-computer-in-office.jpg?s=612x612&w=0&k=20&c=yvp6O83JSvT5md2u-XYwOzHVHXqM5ez_-CIKH3Hj9GI=" 
            alt="Office workspace" 
            className="object-cover w-full h-full opacity-30"
          />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-6 sm:p-12">
          <div className="max-w-md text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Transform Your Workflow</h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8">Join thousands of professionals who trust us to streamline their daily operations.</p>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-4 bg-white/10 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-sm">Secure and reliable</p>
              </div>
              
              <div className="flex items-center space-x-4 bg-white/10 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-sm">Real-time collaboration tools</p>
              </div>
              
              <div className="flex items-center space-x-4 bg-white/10 p-3 sm:p-4 rounded-lg backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <p className="text-sm">Advanced analytics and reporting</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
      </div>
    </div>
  );
};

// Main export with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}