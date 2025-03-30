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

  return (
    <div className="min-h-screen flex">
      {/* Login Form Section */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-lg mr-3"></div>
            <h1 className="text-2xl font-bold text-gray-800">Ecovision Partners</h1>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Create an Account'}
          </h2>
          <p className="text-gray-600 mb-8">
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
              <div className="flex justify-between items-center">
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
                <a href="#" className="text-purple-600 hover:underline">
                  Forgot password
                </a>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300"
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

            <div className="text-center mt-4">
              {isLogin ? (
                <p>
                  Don't have an account? 
                  <Link href='/register'
                    type="button" 
                    onClick={() => setIsLogin(false)}
                    className="text-purple-600 ml-1 hover:underline"
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
      <div className="w-1/2 bg-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/900/1600')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-12">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="w-64 h-64 bg-purple-600/30 rounded-full absolute -top-24 -left-24"></div>
              <div className="w-96 h-96 bg-purple-600/20 rounded-full absolute -bottom-24 -right-24"></div>
              
              <div className="relative z-10">
                <div className="absolute top-0 left-0 w-full h-full">
                  {[1,2,3,4,5].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute rounded-full bg-white/10"
                      style={{
                        width: `${Math.random() * 30 + 10}px`,
                        height: `${Math.random() * 30 + 10}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-20 text-white">
                  <p className="text-2xl font-semibold mb-4">
                    Streamline Your Workflow
                  </p>
                  <p className="text-white/80">
                    Discover a seamless authentication experience that combines security with simplicity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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