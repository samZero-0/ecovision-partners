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
    role: 'user'
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
      // Implement Google Sign-In logic
      toast.success("Google Sign-In functionality to be implemented");
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <ToastContainer />
      
      <div className="w-2xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FaEnvelope className="text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Email</label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Username Input */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FaUser className="text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Username</label>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <label className="text-sm font-medium text-gray-700">Select Role</label>
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Photo URL Input */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FaImage className="text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Profile Picture URL</label>
            </div>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleInputChange}
              placeholder="Optional profile picture URL"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FaLock className="text-gray-400" />
              <label className="text-sm font-medium text-gray-700">Password</label>
            </div>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            
            {/* Password Strength Indicator */}
            <div className="mt-2 h-1 w-full bg-gray-200 rounded">
              <div 
                className={`h-1 rounded transition-all duration-500 ${
                  passwordStrength === 0 ? 'bg-red-500 w-[0%]' :
                  passwordStrength === 1 ? 'bg-red-500 w-[20%]' :
                  passwordStrength === 2 ? 'bg-yellow-500 w-[40%]' :
                  passwordStrength === 3 ? 'bg-yellow-500 w-[60%]' :
                  passwordStrength === 4 ? 'bg-green-500 w-[80%]' :
                  'bg-green-500 w-full'
                }`}
              ></div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Create Account
          </button>

          {/* Google Sign-In */}
          {/* <div className="text-center">
            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-grow mr-3"></div>
              <span className="text-gray-500">or</span>
              <div className="border-t border-gray-300 flex-grow ml-3"></div>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FaGoogle className="mr-2" /> Continue with Google
            </button>
          </div> */}

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;