'use client';
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/providers/AuthProvider";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { createAccount, setUser, googleSignin } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    photo: '',
    password: '',
    role: 'donor'
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '', name: '' };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Name validation
    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      valid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8+ chars, include uppercase, lowercase, number, and special character';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Password strength calculation
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[@$!%*?&]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const { email, password, name, photo, role } = formData;
  
    try {
      const result = await createAccount(email, password);
      const currentUser = result.user;
      setUser(currentUser);
  
      await updateProfile(currentUser, { displayName: name, photoURL: photo });
  
      const userData = {
        displayName: name,
        photoURL: photo,
        email,
        role,
      };
  
      await axios.post("https://ecovision-backend-five.vercel.app/users", userData);
  
      Swal.fire({
        title: "Registration Successful!",
        text: "You have been registered successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      toast.error(`Registration Failed: ${error.message}`);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignin();
      if (result.user) {
        const { displayName, email, photoURL } = result.user;
        
        const userData = {
          displayName,
          photoURL,
          email,
          role: formData.role,
        };
        
        await axios.post("https://ecovision-backend-five.vercel.app/users", userData);
        
        toast.success("Google Sign-In successful");
        router.push("/");
      }
    } catch (error) {
      toast.error(`Google login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Your Account</h2>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Join EcoVision and start making a difference today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <FaEnvelope className="text-green-600 text-sm sm:text-base" />
                <label className="text-sm font-medium text-gray-700">Email</label>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Username Input */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <FaUser className="text-green-600 text-sm sm:text-base" />
                <label className="text-sm font-medium text-gray-700">Full Name</label>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <label className="text-sm font-medium text-gray-700">I would like to join as a</label>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'donor'})}
                  className={`p-2 sm:p-3 border rounded-lg flex items-center justify-center text-sm sm:text-base ${
                    formData.role === 'donor' 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Donor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'volunteer'})}
                  className={`p-2 sm:p-3 border rounded-lg flex items-center justify-center text-sm sm:text-base ${
                    formData.role === 'volunteer' 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">Volunteer</span>
                </button>
              </div>
            </div>

            {/* Photo URL Input */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <FaImage className="text-green-600 text-sm sm:text-base" />
                <label className="text-sm font-medium text-gray-700">Profile Picture URL</label>
              </div>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                placeholder="Optional profile picture URL"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <FaLock className="text-green-600 text-sm sm:text-base" />
                <label className="text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {passwordVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              
              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full flex">
                  {[...Array(5)].map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 w-1/5 ${
                        passwordStrength > index 
                          ? passwordStrength <= 2 
                            ? 'bg-red-500' 
                            : passwordStrength <= 3 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {passwordStrength === 0 && "Enter a password"}
                  {passwordStrength === 1 && "Very weak"}
                  {passwordStrength === 2 && "Weak"}
                  {passwordStrength === 3 && "Medium"}
                  {passwordStrength === 4 && "Strong"}
                  {passwordStrength === 5 && "Very strong"}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm text-sm sm:text-base"
            >
              Create Account
            </button>

            {/* Google Sign-In */}
            <div className="text-center">
              <div className="flex items-center justify-center my-3 sm:my-4">
                <div className="border-t border-gray-300 flex-grow mr-3"></div>
                <span className="text-gray-500 text-xs sm:text-sm">or continue with</span>
                <div className="border-t border-gray-300 flex-grow ml-3"></div>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center border border-gray-300 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <FaGoogle className="text-red-500 mr-2" size={16} /> 
                <span className="font-medium">Google</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="w-full lg:w-1/2 bg-green-600 relative overflow-hidden hidden lg:block">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1513&q=80")',
            filter: 'contrast(1.1) brightness(0.9)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/50 to-teal-800/80"></div>
        
        <div className="relative h-full flex flex-col justify-center px-8 xl:px-16 text-white z-10">
          <h1 className="text-3xl xl:text-4xl font-bold mb-3 xl:mb-4">Join EcoVision</h1>
          <p className="text-lg xl:text-xl mb-4 xl:mb-6">Together we can build a sustainable future for our planet</p>
          
          <div className="space-y-4 xl:space-y-6">
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-5 xl:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm xl:text-base">Make a Difference</h3>
                <p className="text-white/80 text-xs xl:text-sm">Support environmental projects with donations or volunteer your time</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-5 xl:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm xl:text-base">Connect With Others</h3>
                <p className="text-white/80 text-xs xl:text-sm">Join a community of like-minded individuals passionate about sustainability</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xl:h-5 xl:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm xl:text-base">Track Your Impact</h3>
                <p className="text-white/80 text-xs xl:text-sm">See the tangible results of your contributions to environmental conservation</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 xl:mt-12 bg-white/10 rounded-lg p-3 xl:p-4 border border-white/20">
            <blockquote className="italic text-white/90 text-sm xl:text-base">
              "The greatest threat to our planet is the belief that someone else will save it."
            </blockquote>
            <p className="text-right text-xs xl:text-sm mt-1 xl:mt-2">— Robert Swan, Explorer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;